import { Injectable } from '@angular/core';
import {
  ActiveState,
  EntityState,
  EntityStore,
  StoreConfig,
} from '@datorama/akita';
import { CadmusModel } from 'projects/myrmidon/cadmus-shop-core/src/public-api';

export interface ModelListState
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
export class ModelListStore extends EntityStore<
  ModelListState,
  CadmusModel
> {
  constructor() {
    super(INITIAL_STATE);
  }
}
