import {
  StoreConfig,
  EntityStore,
  EntityState,
  ActiveState,
} from '@datorama/akita';
import { Injectable } from '@angular/core';
import { Thesaurus } from 'projects/myrmidon/cadmus-profile-core/src/public-api';

export interface ThesaurusListState
  extends EntityState<Thesaurus, string>,
    ActiveState {}

const INITIAL_STATE = {
  active: null,
};

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'thesauri' })
export class ThesaurusListStore extends EntityStore<ThesaurusListState> {
  constructor() {
    super(INITIAL_STATE);
  }
}