import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { CadmusModel } from 'projects/myrmidon/cadmus-shop-core/src/public-api';
import {
  CadmusModelListState,
  CadmusModelListStore,
} from './cadmus-model-list.store';

@Injectable({
  providedIn: 'root',
})
export class CadmusModelListQuery extends QueryEntity<
  CadmusModelListState,
  CadmusModel
> {
  constructor(store: CadmusModelListStore) {
    super(store);
  }
}
