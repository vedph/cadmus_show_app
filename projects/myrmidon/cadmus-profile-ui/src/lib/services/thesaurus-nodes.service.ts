import { Injectable } from '@angular/core';
import { ThesaurusEntry } from 'projects/myrmidon/cadmus-profile-core/src/public-api';
import {
  DataPage,
  PagingOptions,
} from 'projects/myrmidon/cadmus-shop-core/src/public-api';
import { BehaviorSubject, Observable } from 'rxjs';

/**
 * A thesaurus entry edited in a set of thesauri nodes.
 * The nodes may represent either a hierarchical or a non-hierarchical
 * thesaurus.
 */
export interface ThesaurusNode {
  id: string;
  value: string;
  parentId?: string;
  level?: number;
  expanded?: boolean;
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

  /**
   * Set all the nodes at once.
   *
   * @param nodes The nodes to set.
   * @param supply True to supply parent and children properties
   * from the nodes' parentId values; false if the nodes already
   * have these properties set.
   */
  public setNodes(nodes: ThesaurusNode[], supply = false): void {
    if (supply) {
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
    this._nodes$.next(nodes);

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
  public getPage(filter: ThesaurusNodeFilter): DataPage<ThesaurusNode> {
    filter.idOrValue = filter.idOrValue?.toLowerCase();
    const nodes = this._nodes$.value.filter((node) => {
      return this.matchNode(node, filter);
    });
    const offset = (filter.pageNumber - 1) * filter.pageSize;
    return {
      pageNumber: filter.pageNumber,
      pageSize: filter.pageSize,
      total: nodes.length,
      pageCount: Math.ceil(nodes.length / filter.pageSize),
      items: nodes.slice(offset, offset + filter.pageSize),
    };
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
      nodes.splice(i, 1, node);
    } else {
      // the node has a parent?
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
          nodes.splice(nodes.indexOf(parent) + 1, 0, node);
        } else {
          // if not found, that's an error; treat it as an unparented node
          node.parentId = undefined;
          nodes.push(node);
        }
      } else {
        // no parent: just append
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
    if (i > -1) {
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
      nodes.splice(i, 1);
      // save
      this._nodes$.next(nodes);
    }
  }
}
