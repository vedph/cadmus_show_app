import { Injectable } from '@angular/core';
import { ThesaurusEntry } from '@myrmidon/cadmus-core';
import { DataPage, PagingOptions } from '@myrmidon/cadmus-shop-core';
import { BehaviorSubject, Observable, of } from 'rxjs';

/**
 * A thesaurus entry edited in a set of thesauri nodes.
 * This is used as the view-model for the thesaurus editor.
 * The nodes may represent either a hierarchical or a non-hierarchical
 * thesaurus.
 */
export interface ThesaurusNode extends ThesaurusEntry {
  level: number;
  ordinal: number;
  parentId?: string;
  collapsed?: boolean;
  hasChildren?: boolean;
  lastSibling?: boolean;
}

/**
 * Filter applied to a set of thesauri nodes.
 */
export interface ThesaurusNodeFilter extends PagingOptions {
  idOrValue?: string;
  parentId?: string;
}

/**
 * Service used to edit a set of thesauri nodes.
 * This set corresponds to the entries from a single thesaurus,
 * and is thus used in thesaurus editing. The set includes all
 * the entries, even if editing happens in a paged context.
 */
@Injectable({
  providedIn: 'root',
})
export class ThesaurusNodesService {
  private _nodes$: BehaviorSubject<ThesaurusNode[]>;
  private _parentIds$: BehaviorSubject<ThesaurusEntry[]>;

  /**
   * The number of nodes in this set.
   */
  public get length(): number {
    return this._nodes$.value.length;
  }

  constructor() {
    this._nodes$ = new BehaviorSubject<ThesaurusNode[]>([]);
    this._parentIds$ = new BehaviorSubject<ThesaurusEntry[]>([]);
  }

  /**
   * Get an observable with the full list of nodes.
   */
  public selectNodes(): Observable<ThesaurusNode[]> {
    return this._nodes$.asObservable();
  }

  /**
   * Get an observable with the list of unique parent IDs.
   */
  public selectParentIds(): Observable<ThesaurusEntry[]> {
    return this._parentIds$.asObservable();
  }

  /**
   * Get a full list of all the nodes in this set.
   *
   * @returns An array of nodes.
   */
  public getNodes(): ThesaurusNode[] {
    return [...this._nodes$.value];
  }

  /**
   * Get the list of unique parent node IDs in this set.
   */
  public getParentIds(): ThesaurusEntry[] {
    return [...this._parentIds$.value];
  }

  private refreshParentIds(nodes?: ThesaurusNode[]): void {
    if (!nodes) {
      nodes = this._nodes$.value;
    }
    // collect all the unique parent IDs
    const ids: string[] = [
      ...new Set(nodes.filter((n) => n.parentId).map((n) => n.parentId!)),
    ];

    // get the value for each parent ID
    const entries: ThesaurusEntry[] = [];
    for (let i = 0; i < ids.length; i++) {
      const node = nodes.find((n) => n.id === ids[i]);
      if (node) {
        entries.push({
          id: ids[i],
          value: node.value,
        });
      }
    }

    // update
    this._parentIds$.next(entries);
  }

  /**
   * Assign the parent IDs to the children nodes being imported,
   * according to their ID. If a node ID is composite (using
   * dots as separators), it has a parent equal to its ID minus
   * its last component. This also sets the hasChildren property.
   *
   * @param nodes The nodes.
   */
  private assignParentIds(nodes: ThesaurusNode[]): void {
    nodes.forEach((node) => {
      const i = node.id.lastIndexOf('.');
      if (i > -1) {
        node.parentId = node.id.substr(0, i);
      }
    });

    const parentIds = [...new Set(nodes.map((n) => n.parentId))];
    nodes.forEach((node) => {
      if (parentIds.includes(node.id)) {
        node.hasChildren = true;
      }
    });
  }

  /**
   * Assign depth levels to the nodes being imported.
   *
   * @param nodes The nodes.
   */
  private assignLevels(nodes: ThesaurusNode[]): void {
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];

      if (node.parentId) {
        let n = 1;
        let parentIndex = this.getParentIndex(nodes, i);

        while (parentIndex > -1) {
          n++;
          parentIndex = this.getParentIndex(nodes, parentIndex);
        }
        node.level = n;
      } else {
        node.level = 1;
      }
    }
  }

  /**
   * Assign ordinal and lastSibling properties to the nodes
   * being imported.
   *
   * @param nodes The nodes.
   */
  private assignOrdinals(nodes: ThesaurusNode[]): void {
    // map to hold the last sibling of each set of children
    const map = new Map<string, { ordinal: number; node: ThesaurusNode }>();

    nodes.forEach((node) => {
      const key = node.parentId || '';
      // if it's the 1st child of key, set ordinal=1
      if (!map.has(key)) {
        map.set(key, {
          ordinal: 1,
          node: node,
        });
      } else {
        // else increment the ordinal for the current key
        const existing = map.get(key) as {
          ordinal: number;
          node: ThesaurusNode;
        };
        existing.ordinal++;
        existing.node = node;
      }
      // assign the ordinal to the node
      node.ordinal = map.get(key)?.ordinal as number;
    });

    // set the last-sibling flags
    for (let v of map.values()) {
      v.node.lastSibling = true;
    }
  }

  /**
   * Set all the nodes at once.
   *
   * @param entries The nodes to set.
   */
  public importEntries(entries: ThesaurusEntry[]): void {
    const nodes = entries as ThesaurusNode[];
    this.assignParentIds(nodes);
    this.assignLevels(nodes);
    this.assignOrdinals(nodes);

    this._nodes$.next(nodes);

    this.refreshParentIds();
  }

  private matchNode(node: ThesaurusNode, filter: ThesaurusNodeFilter): boolean {
    // idOrValue
    if (
      filter.idOrValue &&
      !node.id.toLowerCase().includes(filter.idOrValue) &&
      !node.value.toLowerCase().includes(filter.idOrValue)
    ) {
      return false;
    }

    // parentId
    if (filter.parentId && node.parentId !== filter.parentId) {
      return false;
    }

    return true;
  }

  /**
   * Get the specified page of nodes.
   *
   * @param filter The filter.
   * @returns The requested page of nodes.
   */
  public getPage(
    filter: ThesaurusNodeFilter
  ): Observable<DataPage<ThesaurusNode>> {
    // adjust filter
    filter.idOrValue = filter.idOrValue?.toLowerCase();

    // collect page's nodes
    const nodes = this._nodes$.value;
    const pageNodes: ThesaurusNode[] = [];
    let offset = (filter.pageNumber - 1) * filter.pageSize;
    let total = 0;

    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];

      // consider only matching nodes
      if (this.matchNode(node, filter)) {
        // collapsed nodes are excluded
        let collapsed = false;
        if (node.parentId) {
          const parentIndex = this.getParentIndex(nodes, i);
          if (parentIndex > -1 && nodes[parentIndex].collapsed) {
            collapsed = true;
          }
        }
        if (!collapsed) {
          total++;
          if (offset) {
            offset--;
          } else {
            if (pageNodes.length < filter.pageSize) {
              pageNodes.push(node);
            }
          }
        }
      }
    }

    return of({
      pageNumber: filter.pageNumber,
      pageSize: filter.pageSize,
      total: total,
      pageCount: Math.ceil(total / filter.pageSize),
      items: pageNodes,
    });
  }

  private insertAt(node: ThesaurusNode, startIndex: number): ThesaurusNode[] {
    // start from its 1st child and find insertion position,
    // as given by the new node's ordinal number
    let n = 1; // 1st child ordinal
    let i = startIndex;
    const nodes = this._nodes$.value;
    while (
      i < nodes.length &&
      (!node.parentId || nodes[i].parentId === node.parentId) &&
      (node.level !== nodes[i].level || n < node.ordinal)
    ) {
      n++;
      i++;
    }
    // insert
    node.lastSibling =
      i === nodes.length ||
      (i + 1 < nodes.length && nodes[i + 1].parentId !== node.parentId);
    node.ordinal = n++;
    nodes.splice(i, 0, node);

    // preceding sibling is no more the last if it was
    if (node.lastSibling && nodes[i - 1].lastSibling) {
      nodes[i - 1].lastSibling = false;
    }

    // update the following siblings if any
    i++;
    while (i < nodes.length && nodes[i].parentId === node.parentId) {
      nodes[i++].ordinal = n++;
      // lastSibling is already ok when there are following siblings
    }
    return nodes;
  }

  /**
   * Add or replace the specified node.
   *
   * @param node The node.
   */
  public add(node: ThesaurusNode): void {
    // find the node being added
    let nodes = [...this._nodes$.value];
    const i = nodes.findIndex((n) => n.id === node.id);

    // if found, replace an existing node
    if (i > -1) {
      node.ordinal = nodes[i].ordinal;
      node.lastSibling = nodes[i].lastSibling;
      nodes.splice(i, 1, node);
    } else {
      // else it's a new node -- has the node a parent?
      if (node.parentId) {
        // yes: append the new node as its last child
        let i = nodes.findIndex((p) => p.id === node.parentId);
        if (i === -1) {
          console.error('Parent node not found: ' + node.parentId);
          return;
        }
        // the parent should have its hasChildren set
        const parent = nodes[i];
        if (!parent.hasChildren) {
          nodes.splice(i, 1, { ...parent, hasChildren: true });
        }
        // start from its 1st child and find insertion position,
        // as given by the new node's ordinal number
        i++; // 1st child
        nodes = this.insertAt(node, i);
      } else {
        // no parent
        nodes = this.insertAt(node, 0);
      }
    }

    // save (we must refresh parent IDs as we might have an updated node
    // changing the original hierarchy)
    this.refreshParentIds(nodes);
    this._nodes$.next(nodes);
  }

  private getParentIndex(nodes: ThesaurusNode[], childIndex: number): number {
    let i = childIndex - 1;
    while (i > -1 && nodes[i].id !== nodes[childIndex].parentId) {
      i--;
    }
    return i;
  }

  /**
   * Delete the node with the specified ID.
   *
   * @param id The ID of the node to delete.
   */
  public delete(id: string): void {
    // find and delete
    const nodes = [...this._nodes$.value];
    const i = nodes.findIndex((n) => n.id === id);
    if (i === -1) {
      return;
    }
    const deleted = nodes[i];
    nodes.splice(i, 1);

    // if it was the last sibling:
    if (deleted.lastSibling) {
      // if it was also the 1st, we have removed all the children
      if (deleted.ordinal === 1) {
        // clear the children in the parent node
        const parentIndex = this.getParentIndex(nodes, i);
        if (parentIndex > -1) {
          nodes.splice(parentIndex, 1, {
            ...nodes[parentIndex],
            hasChildren: false,
          });
        }
      } else {
        // else the previous one, if any, is now the last sibling
        if (nodes[i - 1].parentId === deleted.parentId) {
          const prevSibling = nodes[i - 1];
          nodes.splice(i - 1, 1, { ...prevSibling, lastSibling: true });
        }
      }
    }

    // update ordinals for the next siblings if any
    let j = i;
    while (j < nodes.length && nodes[j].parentId === deleted.parentId) {
      const sibling = nodes[j];
      nodes.splice(j, 1, { ...sibling, ordinal: sibling.ordinal - 1 });
      j++;
    }

    // save
    this.refreshParentIds();
    this._nodes$.next(nodes);
  }

  private swapSiblings(id: string, up: boolean): void {
    const nodes = [...this._nodes$.value];
    const index = nodes.findIndex((n) => n.id === id);
    if (index === -1) {
      return;
    }
    const node = { ...nodes[index] };
    let sibling: ThesaurusNode;

    if (up) {
      // must not be 1st sibling
      if (node.ordinal === 1) {
        return;
      }
      // adjust and move
      sibling = { ...nodes[index - 1] };
      node.ordinal--;
      sibling.ordinal++;
      if (node.lastSibling) {
        node.lastSibling = undefined;
        sibling.lastSibling = true;
      }
      nodes.splice(index - 1, 2, node, sibling);
    } else {
      // must not be last sibling
      if (node.lastSibling) {
        return;
      }
      // adjust and move
      sibling = { ...nodes[index + 1] };
      node.ordinal++;
      sibling.ordinal--;
      if (sibling.lastSibling) {
        node.lastSibling = true;
        sibling.lastSibling = undefined;
      }
      nodes.splice(index, 2, sibling, node);
    }

    // refresh
    this._nodes$.next(nodes);
  }

  /**
   * Move the node with the specified ID up in the list of its
   * sibling nodes.
   *
   * @param id The ID of the node to be moved.
   */
  public moveUp(id: string): void {
    this.swapSiblings(id, true);
  }

  /**
   * Move the node with the specified ID down in the list of its
   * sibling nodes.
   *
   * @param id The ID of the node to be moved.
   */
  public moveDown(id: string): void {
    this.swapSiblings(id, false);
  }

  /**
   * Toggle the expanded/collapsed state for all the nodes at once.
   *
   * @param collapsed The collapsed state to be set.
   */
  public toggleAll(collapsed: boolean): void {
    const nodes: ThesaurusNode[] = [];
    this._nodes$.value.forEach((node) => {
      nodes.push({ ...node, collapsed: collapsed });
    });
    this._nodes$.next(nodes);
  }
}
