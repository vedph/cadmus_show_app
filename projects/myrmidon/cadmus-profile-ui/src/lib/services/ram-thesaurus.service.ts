import { Injectable } from '@angular/core';
import {
  Thesaurus,
  ThesaurusFilter,
} from 'projects/myrmidon/cadmus-profile-core/src/public-api';
import { DataPage } from 'projects/myrmidon/cadmus-shop-core/src/public-api';
import { Observable, of } from 'rxjs';

/**
 * This service keeps all the thesauri from a project in RAM.
 */
@Injectable({
  providedIn: 'root',
})
export class RamThesaurusService {
  private _thesauri: Thesaurus[];

  constructor() {
    this._thesauri = [];
  }

  public setAll(thesauri: Thesaurus[]): void {
    this._thesauri = thesauri;
  }

  /**
   * Get the thesaurus with the specified ID.
   *
   * @param id The thesaurus ID.
   * @returns Observable with thesaurus.
   */
  public get(id: string): Observable<Thesaurus | undefined> {
    return of(this._thesauri.find((t) => t.id === id));
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

  /**
   * Get a page of thesauri.
   *
   * @param filter The filter.
   * @returns The page.
   */
  public getPage(filter: ThesaurusFilter): Observable<DataPage<Thesaurus>> {
    const thesauri = this._thesauri
      .filter((t) => {
        return this.matchThesaurus(t, filter);
      })
      .sort((a, b) => {
        return a.id.localeCompare(b.id);
      });

    return of({
      pageNumber: filter.pageNumber,
      pageSize: filter.pageSize,
      pageCount: Math.ceil(thesauri.length / filter.pageSize),
      total: thesauri.length,
      items: thesauri.slice(
        (filter.pageNumber - 1) * filter.pageSize,
        filter.pageSize
      ),
    });
  }

  public addThesaurus(thesaurus: Thesaurus): Observable<Thesaurus> {
    const i = this._thesauri.findIndex((t) => t.id === thesaurus.id);
    if (i > -1) {
      this._thesauri.splice(i, 1, thesaurus);
    } else {
      this._thesauri.push(thesaurus);
    }
    return of(thesaurus);
  }

  public deleteThesaurus(id: string): Observable<any> {
    const i = this._thesauri.findIndex((t) => t.id === id);
    if (i > -1) {
      this._thesauri.splice(i, 1);
      return of(true);
    }
    return of(false);
  }
}
