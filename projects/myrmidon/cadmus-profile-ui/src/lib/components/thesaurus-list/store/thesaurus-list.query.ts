import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import {
  Thesaurus,
  ThesaurusFilter,
} from 'projects/myrmidon/cadmus-profile-core/src/public-api';
import { DataPage } from 'projects/myrmidon/cadmus-shop-core/src/public-api';
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

  private matchThesaurus(
    thesaurus: Thesaurus,
    filter: ThesaurusFilter
  ): boolean {
    if (filter.id && thesaurus.id !== filter.id) {
      return false;
    }
    if (filter.isAlias === true && !thesaurus.targetId) {
      return false;
    }
    if (filter.isAlias === false && thesaurus.targetId) {
      return false;
    }
    if (filter.language && thesaurus.language !== filter.language) {
      return false;
    }
    return true;
  }

  public getPage(filter: ThesaurusFilter): DataPage<Thesaurus> {
    const thesauri = [...this.getAll()]
      .filter((t) => {
        return this.matchThesaurus(t, filter);
      })
      .sort((a, b) => {
        return a.id.localeCompare(b.id);
      });

    return {
      pageNumber: filter.pageNumber,
      pageSize: filter.pageSize,
      pageCount: Math.ceil(thesauri.length / filter.pageSize),
      total: thesauri.length,
      items: thesauri.slice(
        (filter.pageNumber - 1) * filter.pageSize,
        filter.pageSize
      ),
    };
  }
}
