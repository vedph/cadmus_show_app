import { Injectable } from '@angular/core';
import {
  ActiveState,
  EntityState,
  EntityStore,
  StoreConfig,
} from '@datorama/akita';
import { FlagDefinition } from 'projects/myrmidon/cadmus-profile-core/src/public-api';

export interface FlagListState
  extends EntityState<FlagDefinition, number>,
    ActiveState {}

const INITIAL_STATE = {
  active: null,
};

/**
 * The flag definitions list store.
 */
@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'flags' })
export class FlagListStore extends EntityStore<FlagListState> {
  constructor() {
    super(INITIAL_STATE);
  }
}
