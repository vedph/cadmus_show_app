import { Injectable } from '@angular/core';
import {
  DataPage,
  PagingOptions,
} from 'projects/myrmidon/cadmus-shop-core/src/public-api';
import { BehaviorSubject, Observable } from 'rxjs';

/**
 * A thesaurus entry edited in a set of thesauri nodes.
 */
export interface ThesaurusNode {
  id: string;
  value: string;
  level?: number;
  expanded?: boolean;
  parent?: ThesaurusNode;
  children?: ThesaurusNode[];
}

/**
 * Filter applied to a set of thesauri nodes.
 */
export interface ThesaurusNodeFilter extends PagingOptions {
  id?: string;
  value?: string;
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

  /**
   * The full list of nodes in the thesaurus.
   */
  public get nodes$(): Observable<ThesaurusNode[]> {
    return this._nodes$;
  }

  constructor() {
    this._nodes$ = new BehaviorSubject<ThesaurusNode[]>([]);
  }

  /**
   * Set all the nodes at once.
   *
   * @param nodes The nodes to set.
   */
  public setNodes(nodes: ThesaurusNode[]): void {
    this._nodes$.next(nodes);
  }

  private matchNode(node: ThesaurusNode, filter: ThesaurusNodeFilter): boolean {
    if (filter.id && !node.id.toLowerCase().includes(filter.id)) {
      return false;
    }
    if (filter.value && !node.value.toLowerCase().includes(filter.value)) {
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
    filter.id = filter.id?.toLowerCase();
    filter.value = filter.value?.toLowerCase();
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
}
