import { Injectable } from '@angular/core';
import { Thesaurus } from '@myrmidon/cadmus-core';
import { ThesaurusListQuery } from './thesaurus-list.query';
import { ThesaurusListStore } from './thesaurus-list.store';

/**
 * Service used to write data into the Thesauruss list store.
 */
@Injectable({
  providedIn: 'root',
})
export class ThesaurusListService {
  constructor(private _store: ThesaurusListStore, private _query: ThesaurusListQuery) {}

  /**
   * Set all the thesauri.
   *
   * @param thesauri The thesauri to set.
   */
  public set(thesauri: Thesaurus[]): void {
    this._store.set(thesauri);
  }
}
