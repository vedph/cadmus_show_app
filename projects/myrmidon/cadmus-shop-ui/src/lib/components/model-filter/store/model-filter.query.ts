import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { CadmusModelFilter } from '@myrmidon/cadmus-shop-core';
import { ModelFilterStore } from './model-filter.store';

@Injectable({
  providedIn: 'root',
})
export class ModelFilterQuery extends Query<CadmusModelFilter> {
  constructor(store: ModelFilterStore) {
    super(store);
  }
}
