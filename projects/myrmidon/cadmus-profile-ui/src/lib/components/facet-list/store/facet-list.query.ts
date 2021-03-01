import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { FacetListState, FacetListStore, GroupingFacet } from './facet-list.store';

@Injectable({
  providedIn: 'root',
})
export class FacetListQuery extends QueryEntity<FacetListState> {
  constructor(store: FacetListStore) {
    super(store);
  }
}
