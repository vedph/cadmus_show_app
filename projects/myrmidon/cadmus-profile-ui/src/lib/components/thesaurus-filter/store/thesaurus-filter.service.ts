import { Injectable } from '@angular/core';
import { ThesaurusFilter } from 'projects/myrmidon/cadmus-profile-core/src/public-api';
import { ThesaurusFilterStore } from './thesaurus-filter.store';

/**
 * Service used to write data into the thesaurus filter store.
 */
@Injectable({
  providedIn: 'root',
})
export class ThesaurusFilterService {
  constructor(private _store: ThesaurusFilterStore) {}

  public setPage(pageNumber: number, pageSize: number): void {
    this._store.update({
      pageNumber: pageNumber,
      pageSize: pageSize,
    });
  }

  public setFilter(filter: ThesaurusFilter): void {
    this._store.update({
      idOrValue: filter.idOrValue,
      isAlias: filter.isAlias,
      language: filter.language
    });
  }
}
