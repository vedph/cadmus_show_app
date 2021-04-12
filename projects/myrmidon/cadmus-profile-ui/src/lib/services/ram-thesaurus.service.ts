import { Injectable } from '@angular/core';
import { Thesaurus } from '@myrmidon/cadmus-core';
import {
  ThesaurusFilter,
} from '@myrmidon/cadmus-profile-core';
import { DataPage } from '@myrmidon/cadmus-shop-core';
import { BehaviorSubject, Observable, of } from 'rxjs';

/**
 * This service keeps in RAM all the thesauri from a project.
 * In a server-based environment, we'd rather have a thesaurus
 * service fetching only the required thesauri.
 */
@Injectable({
  providedIn: 'root',
})
export class RamThesaurusService {
  private _thesauri$: BehaviorSubject<Thesaurus[]>;

  /**
   * The count of thesauri provided by this service.
   */
  public get count(): number {
    return this._thesauri$.value.length;
  }

  /**
   * The thesauri provided by this service.
   */
  public get thesauri$(): Observable<Thesaurus[]> {
    return this._thesauri$.asObservable();
  }

  constructor() {
    this._thesauri$ = new BehaviorSubject<Thesaurus[]>([]);
  }

  /**
   * Set all the thesauri for this service.
   *
   * @param thesauri The thesauri.
   */
  public setAll(thesauri: Thesaurus[]): void {
    this._thesauri$.next(thesauri);
  }

  /**
   * Get the thesaurus with the specified ID.
   *
   * @param id The thesaurus ID.
   * @returns Observable with thesaurus.
   */
  public get(id: string): Observable<Thesaurus | undefined> {
    return of(this._thesauri$.value.find((t) => t.id === id));
  }

  private matchThesaurus(
    thesaurus: Thesaurus,
    filter: ThesaurusFilter
  ): boolean {
    if (filter.idOrValue && !thesaurus.id.includes(filter.idOrValue)) {
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
    const thesauri = this._thesauri$.value
      .filter((t) => {
        return this.matchThesaurus(t, filter);
      })
      .sort((a, b) => {
        return a.id.localeCompare(b.id);
      });

    const offset = (filter.pageNumber - 1) * filter.pageSize;
    return of({
      pageNumber: filter.pageNumber,
      pageSize: filter.pageSize,
      pageCount: Math.ceil(thesauri.length / filter.pageSize),
      total: thesauri.length,
      items: thesauri.slice(offset, offset + filter.pageSize),
    });
  }

  /**
   * Add or update the specified thesaurus.
   *
   * @param thesaurus The thesaurus to add or update.
   * @returns The new thesaurus.
   */
  public addThesaurus(thesaurus: Thesaurus): Observable<Thesaurus> {
    const i = this._thesauri$.value.findIndex((t) => t.id === thesaurus.id);
    const thesauri = [...this._thesauri$.value];

    if (i > -1) {
      thesauri.splice(i, 1, thesaurus);
    } else {
      thesauri.push(thesaurus);
    }
    this._thesauri$.next(thesauri);
    return of(thesaurus);
  }

  /**
   * Delete the thesaurus with the specified ID.
   *
   * @param id The thesaurus ID.
   * @returns True if deleted, false if not found.
   */
  public deleteThesaurus(id: string): Observable<boolean> {
    const i = this._thesauri$.value.findIndex((t) => t.id === id);
    if (i > -1) {
      const thesauri = [...this._thesauri$.value];
      thesauri.splice(i, 1);
      this._thesauri$.next(thesauri);
      return of(true);
    }
    return of(false);
  }
}
