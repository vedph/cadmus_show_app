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
  parentId?: string;
  level: number;
  ordinal: number;
  expanded?: boolean;
  lastSibling?: boolean;
  parent?: ThesaurusNode;
  children?: ThesaurusNode[];
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

  private refreshParents(): void {
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

  private assignParentIds(nodes: ThesaurusNode[]): void {
    nodes.forEach((node) => {
      const i = node.id.lastIndexOf('.');
      if (i > -1) {
        node.parentId = node.id.substr(0, i);
      }
    });
  }

  private assignRelations(nodes: ThesaurusNode[]): void {
    nodes.forEach((node) => {
      if (node.parentId) {
        node.parent = nodes.find((n) => n.id === node.parentId);
        if (node.parent) {
          if (!node.parent.children) {
            node.parent.children = [];
          }
          node.parent.children.push(node);
        }
      }
    });
  }

  private assignLevels(nodes: ThesaurusNode[]): void {
    nodes.forEach((node) => {
      if (node.parent) {
        let n = 0;
        let parent: ThesaurusNode | undefined = node.parent;
        while (parent) {
          n++;
          parent = parent.parent;
        }
        node.level = n;
      }
    });
  }

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
    this.assignParentIds(entries as ThesaurusNode[]);
    this.assignRelations(entries as ThesaurusNode[]);
    this.assignLevels(entries as ThesaurusNode[]);
    this.assignOrdinals(entries as ThesaurusNode[]);
    this._nodes$.next(entries as ThesaurusNode[]);

    this.refreshParents();
  }

  private matchNode(node: ThesaurusNode, filter: ThesaurusNodeFilter): boolean {
    if (
      filter.idOrValue &&
      !node.id.toLowerCase().includes(filter.idOrValue) &&
      !node.value.toLowerCase().includes(filter.idOrValue)
    ) {
      return false;
    }
    if (
      filter.parentId &&
      (!node.parent || node.parent.id !== filter.parentId)
    ) {
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
    filter.idOrValue = filter.idOrValue?.toLowerCase();
    const nodes = this._nodes$.value.filter((node) => {
      return this.matchNode(node, filter);
    });
    const offset = (filter.pageNumber - 1) * filter.pageSize;
    return of({
      pageNumber: filter.pageNumber,
      pageSize: filter.pageSize,
      total: nodes.length,
      pageCount: Math.ceil(nodes.length / filter.pageSize),
      items: nodes.slice(offset, offset + filter.pageSize),
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

    // replace an existing node in place
    if (i > -1) {
      node.ordinal = nodes[i].ordinal;
      node.lastSibling = nodes[i].lastSibling;
      nodes.splice(i, 1, node);
    } else {
      // else it's a new node --
      // has the node a parent?
      if (node.parentId) {
        // yes: find it
        const parent = nodes.find((n) => n.id === node.parentId);
        if (parent) {
          // if found, add the node as its child...
          node.parent = parent;
          if (!parent.children) {
            parent.children = [];
          }
          parent.children.push(node);

          // ... and insert it as its last child
          let n = 1;
          if (parent.children.length) {
            const lastChild = parent.children[parent.children.length - 1];
            n = lastChild.ordinal + 1;
            lastChild.lastSibling = false;
          }
          node.ordinal = n;
          node.lastSibling = true;
          nodes.splice(nodes.indexOf(parent) + 1, 0, node);
        } else {
          // if not found, that's an error: do nothing
          console.error('Node parent ID not found: ' + node.parentId);
          return;
        }
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

  /**
   * Delete the node with the specified ID.
   *
   * @param id The ID of the node to delete.
   */
  public delete(id: string): void {
    const nodes = [...this._nodes$.value];
    const i = nodes.findIndex((n) => n.id === id);
    if (i === -1) {
      return;
    }
    // if it is a child, remove from its parent
    if (nodes[i].parentId) {
      const parent = nodes.find((n) => n.id === nodes[i].parentId);
      if (parent?.children) {
        const ci = parent.children.findIndex((n) => n.id === nodes[i].id);
        parent.children.splice(ci, 1);
        // if no more children remain, update the parent ids
        if (!parent.children.length) {
          const ids = [...this._parentIds$.value];
          const i = ids.findIndex((entry) => entry.id === parent.id);
          if (i > -1) {
            ids.splice(i, 1);
            this._parentIds$.next(ids);
          }
        }
      }
    }

    // update ordinals
    if (nodes[i].lastSibling && i) {
      nodes[i - 1].lastSibling = true;
    }
    for (let j = i + 1; j < nodes.length; j++) {
      if (nodes[j].parentId === nodes[i].parentId) {
        nodes[j].ordinal--;
      }
    }

    nodes.splice(i, 1);
    // save
    this._nodes$.next(nodes);
  }
}
