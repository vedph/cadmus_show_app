import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { CadmusModelFilter } from 'projects/myrmidon/cadmus-shop-core/src/public-api';
import { ModelFilterStore } from './model-filter.store';

@Injectable({
  providedIn: 'root',
})
export class ModelFilterQuery extends Query<CadmusModelFilter> {
  constructor(store: ModelFilterStore) {
    super(store);
  }
}
