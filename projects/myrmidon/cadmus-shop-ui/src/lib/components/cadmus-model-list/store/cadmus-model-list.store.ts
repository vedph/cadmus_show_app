import { Injectable } from '@angular/core';
import {
  ActiveState,
  EntityState,
  EntityStore,
  StoreConfig,
} from '@datorama/akita';
import { CadmusModel } from 'projects/myrmidon/cadmus-shop-core/src/public-api';

export interface CadmusModelListState
  extends EntityState<CadmusModel, string>,
    ActiveState {}

const INITIAL_STATE = {
  active: null,
};

/**
 * Thesauri list store. This contains a page of thesauri.
 */
@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'models' })
export class CadmusModelListStore extends EntityStore<
  CadmusModelListState,
  CadmusModel
> {
  constructor() {
    super(INITIAL_STATE);
  }
}
