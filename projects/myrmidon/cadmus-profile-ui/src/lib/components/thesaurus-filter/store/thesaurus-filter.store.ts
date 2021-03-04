import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';
import { ThesaurusFilter } from 'projects/myrmidon/cadmus-profile-core/src/public-api';

const INITIAL_STATE: ThesaurusFilter = {
  pageNumber: 1,
  pageSize: 20,
};

/**
 * The thesaurus filter store.
 */
@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'thesaurus-filter' })
export class ThesaurusFilterStore extends Store<ThesaurusFilter> {
  constructor() {
    super(INITIAL_STATE);
  }
}
