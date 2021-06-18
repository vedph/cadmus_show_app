import { Injectable } from '@angular/core';
import { Thesaurus } from '@myrmidon/cadmus-core';
import { ThesaurusFilter } from '@myrmidon/cadmus-core';
import { DataPage } from '@myrmidon/cadmus-shop-core';
import { BehaviorSubject, Observable, of } from 'rxjs';

/**
 * An entry returned by the lookup function of the
 * RamThesaurusService.
 */
export interface LookupThesaurusEntry {
  id: string;
  targetId?: string;
}

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
   * Get an array with all the thesauri.
   *
   * @returns All the thesauri.
   */
  public getAll(): Thesaurus[] {
    return [...this._thesauri$.value];
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
    if (filter.id && !thesaurus.id.includes(filter.id)) {
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

  /**
   * Lookup the IDs of the first limit thesauri matching filter.
   *
   * @param filter The thesaurus ID filter.
   * @param includeAlias True to include aliases.
   * @param limit The maximum number of matches to return.
   * @returns Thesauri lookup data.
   */
  public lookup(
    filter: string,
    includeAlias = false,
    limit = 10
  ): Observable<LookupThesaurusEntry[]> {
    return of(
      this._thesauri$.value
        .filter((t) =>
          includeAlias
            ? t.id.includes(filter)
            : !t.targetId && t.id.includes(filter)
        )
        .map((t) => {
          return { id: t.id, targetId: t.targetId };
        })
        .sort((a, b) => a.id.localeCompare(b.id))
        .slice(0, limit)
    );
  }

  public getThesaurusIds(filter?: ThesaurusFilter): Observable<string[]> {
    return of(
      this._thesauri$.value
        .filter((t) => !filter?.id || t.id.includes(filter.id))
        .map((t) => {
          return t.id;
        })
        .sort((a, b) => a.localeCompare(b))
        .slice(0, filter?.pageSize || 10)
    );
  }
}
