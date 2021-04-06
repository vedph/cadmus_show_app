import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { CadmusModel } from '@myrmidon/cadmus-shop-core';
import {
  ModelListState,
  ModelListStore,
} from './model-list.store';

@Injectable({
  providedIn: 'root',
})
export class ModelListQuery extends QueryEntity<
  ModelListState,
  CadmusModel
> {
  constructor(store: ModelListStore) {
    super(store);
  }
}
