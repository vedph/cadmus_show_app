import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { Thesaurus } from 'projects/myrmidon/cadmus-profile-core/src/public-api';
import { ThesaurusListState, ThesaurusListStore } from './thesaurus-list.store';

@Injectable({
  providedIn: 'root',
})
export class ThesaurusListQuery extends QueryEntity<
  ThesaurusListState,
  Thesaurus
> {
  constructor(store: ThesaurusListStore) {
    super(store);
  }
}
