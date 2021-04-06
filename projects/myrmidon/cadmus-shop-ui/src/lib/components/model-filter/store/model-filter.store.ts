import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';
import { CadmusModelFilter } from '@myrmidon/cadmus-shop-core';

const INITIAL_STATE: CadmusModelFilter = {
  pageNumber: 1,
  pageSize: 20,
};

/**
 * The Cadmus model filter store.
 */
@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'model-filter' })
export class ModelFilterStore extends Store<CadmusModelFilter> {
  constructor() {
    super(INITIAL_STATE);
  }
}
