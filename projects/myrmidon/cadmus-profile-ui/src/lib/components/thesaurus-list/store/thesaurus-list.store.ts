import {
  StoreConfig,
  EntityStore,
  EntityState,
  ActiveState,
} from '@datorama/akita';
import { Injectable } from '@angular/core';
import { Thesaurus } from '@myrmidon/cadmus-core';

export interface ThesaurusListState
  extends EntityState<Thesaurus, string>,
    ActiveState {}

const INITIAL_STATE = {
  active: null,
};

/**
 * Thesauri list store. This contains a single page of thesauri.
 * The full set of thesauri is never loaded in the store at once,
 * as often it would be too big for an optimal user experience.
 * Rather, thesauri are fetched by a RamThesaurusService.
 */
@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'thesauri' })
export class ThesaurusListStore extends EntityStore<
  ThesaurusListState,
  Thesaurus
> {
  constructor() {
    super(INITIAL_STATE);
  }
}
