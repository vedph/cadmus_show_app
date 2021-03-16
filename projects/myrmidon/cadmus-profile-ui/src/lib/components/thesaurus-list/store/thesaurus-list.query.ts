import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { Thesaurus } from '@myrmidon/cadmus-core';
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
