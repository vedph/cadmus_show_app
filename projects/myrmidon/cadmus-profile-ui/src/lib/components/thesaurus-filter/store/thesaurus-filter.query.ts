import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { ThesaurusFilter } from 'projects/myrmidon/cadmus-profile-core/src/public-api';
import { ThesaurusFilterStore } from './thesaurus-filter.store';

@Injectable({
  providedIn: 'root',
})
export class ThesaurusFilterQuery extends Query<ThesaurusFilter> {
  constructor(store: ThesaurusFilterStore) {
    super(store);
  }
}
