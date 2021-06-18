import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { ThesaurusFilter } from '@myrmidon/cadmus-core';
import { ThesaurusFilterStore } from './thesaurus-filter.store';

@Injectable({
  providedIn: 'root',
})
export class ThesaurusFilterQuery extends Query<ThesaurusFilter> {
  constructor(store: ThesaurusFilterStore) {
    super(store);
  }
}
