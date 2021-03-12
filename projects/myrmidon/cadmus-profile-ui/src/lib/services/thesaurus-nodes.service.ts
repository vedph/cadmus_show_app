import { Injectable } from '@angular/core';
import { ThesaurusEntry } from 'projects/myrmidon/cadmus-profile-core/src/public-api';
import {
  DataPage,
  PagingOptions,
} from 'projects/myrmidon/cadmus-shop-core/src/public-api';
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
 */
@Injectable({
  providedIn: 'root',
})
export class ThesaurusNodesService {
  private _nodes$: BehaviorSubject<ThesaurusNode[]>;
  private _parentIds$: BehaviorSubject<ThesaurusEntry[]>;

  constructor() {
    this._nodes$ = new BehaviorSubject<ThesaurusNode[]>([]);
    this._parentIds$ = new BehaviorSubject<ThesaurusEntry[]>([]);
  }

  /**
   * Get an observable with the full list of nodes.
   */
  public selectNodes(): Observable<ThesaurusNode[]> {
    return this._nodes$;
  }

  /**
   * Get an observable with the list of unique parent IDs.
   */
  public selectParentIds(): Observable<ThesaurusEntry[]> {
    return this._parentIds$;
  }

  /**
   * Get the full list of nodes.
   *
   * @returns An array of nodes.
   */
  public getNodes(): ThesaurusNode[] {
    return [...this._nodes$.value];
  }

  /**
   * Get the list of unique parent IDs.
   */
  public getParentIds(): ThesaurusEntry[] {
    return [...this._parentIds$.value];
  }

  private refreshParentIds(): void {
    const entries = this._nodes$.value
      .filter((n) => n.parentId)
      .map((n) => {
        return { id: n.id, value: n.value };
      });

    const uniqueEntries: ThesaurusEntry[] = [];
    entries.forEach((entry) => {
      if (!uniqueEntries.find((e) => e.id === entry.id)) {
        uniqueEntries.push(entry);
      }
    });
    this._parentIds$.next(uniqueEntries);
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
    const map = new Map<string, { ordinal: number; node: ThesaurusNode }>();

    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      const key = node.parentId || '';
      if (!map.has(key)) {
        map.set(key, {
          ordinal: 1,
          node: node,
        });
      } else {
        const old = map.get(key) as { ordinal: number; node: ThesaurusNode };
        old.ordinal++;
      }
      node.ordinal = map.get(key)?.ordinal as number;
    }

    // set last flags
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

  /**
   * Add or replace the specified node.
   *
   * @param node The node.
   */
  public add(node: ThesaurusNode): void {
    const nodes = [...this._nodes$.value];
    const i = nodes.findIndex((n) => n.id === node.id);

    // replace an existing node
    if (i > -1) {
      node.ordinal = nodes[i].ordinal;
      node.lastSibling = nodes[i].lastSibling;
      nodes.splice(i, 1, node);
    } else {
      // else it's a new node -- has the node a parent?
      if (node.parentId) {
        // yes: append as the last child
        let i = nodes.findIndex((p) => p.id === node.parentId);
        if (i === -1) {
          console.log('Parent node not found: ' + node.parentId);
          return;
        }
        // the parent should have its hasChildren set
        const parent = nodes[i];
        if (!parent.hasChildren) {
          nodes.splice(i, 1, { ...parent, hasChildren: true });
        }
        // assign ordinals and lastSibling
        i++;
        let n = 1;
        while (i < nodes.length && nodes[i].parentId === node.parentId) {
          n++;
          i++;
        }
        node.lastSibling = true;
        node.ordinal = n;
        nodes.splice(i, 0, node);
      } else {
        // no parent: just append
        if (nodes.length) {
          nodes[nodes.length - 1].lastSibling = false;
        }
        node.ordinal = nodes.length + 1;
        node.lastSibling = true;
        nodes.push(node);
      }
    }

    // save
    this._nodes$.next(nodes);

    // if the added node has a parent, update the parent IDs if required
    if (
      node.parentId &&
      !this._parentIds$.value.find((entry) => entry.id === node.parentId)
    ) {
      const parent = this._nodes$.value.find((p) => p.id === node.parentId);
      this._parentIds$.next([
        ...this._parentIds$.value,
        { id: node.parentId, value: parent?.value || node.parentId },
      ]);
    }
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
    // delete
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
        const parentIndex = this.getParentIndex(nodes, i);
        nodes.splice(parentIndex, 1, {
          ...nodes[parentIndex],
          hasChildren: false,
        });
      } else {
        // else the previous one, if any, is now the last sibling
        if (nodes[i - 1].parentId === deleted.parentId) {
          const prevSibling = nodes[i - 1];
          nodes.splice(i - 1, 1, { ...prevSibling, lastSibling: true });
        }
      }
    }

    // update ordinals for the next siblings if any
    let j = i + 1;
    while (j < nodes.length && nodes[j].parentId === deleted.parentId) {
      const sibling = nodes[j];
      nodes.splice(j, 1, { ...sibling, ordinal: sibling.ordinal - 1 });
      j++;
    }

    // save
    this._nodes$.next(nodes);
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
