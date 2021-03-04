import { Injectable } from '@angular/core';
import { Thesaurus } from 'projects/myrmidon/cadmus-profile-core/src/public-api';
import { ThesaurusListStore } from './thesaurus-list.store';

@Injectable({
  providedIn: 'root',
})
export class ThesaurusListService {
  constructor(
    private _store: ThesaurusListStore
  ) {}

  /**
   * Set all the thesauri.
   *
   * @param thesauri The thesauri to set.
   */
  public set(thesauri: Thesaurus[]): void {
    this._store.set(thesauri);
  }

  private getNextId(): string {
    const r = new RegExp('^thesaurus([0-9]+)$');

    const max = (this._store.getValue().ids || [])
      // only IDs matching thesaurusN
      .filter((id) => {
        return r.test(id);
      })
      // extract N
      .map((id) => {
        const m = r.exec(id);
        let n = 0;
        if (m) {
          n = +m[1];
        }
        return n;
      })
      // get max(N)
      .reduce((p, c) => {
        return Math.max(p, c);
      });
    return `thesaurus${max + 1}`;
  }

  /**
   * Add a new thesaurus.
   *
   * @returns The ID of the new thesaurus.
   */
  public addThesaurus(): string {
    const id = this.getNextId();
    const thesaurus: Thesaurus = {
      id: id,
      language: 'en',
      entries: [],
    };
    this._store.add(thesaurus);
    this._store.setActive(thesaurus.id);
    return thesaurus.id;
  }

  /**
   * Delete the thesaurus with the specified ID.
   *
   * @param id The thesaurus' ID.
   */
  public deleteThesaurus(id: string): void {
    this._store.remove(id);
  }

  /**
   * Update the specified thesaurus.
   *
   * @param thesaurus The thesaurus to update.
   */
  public updateThesaurus(thesaurus: Thesaurus): void {
    this._store.upsert(thesaurus.id, thesaurus);
  }

  /**
   * Set the active thesaurus.
   *
   * @param id The ID of the thesaurus to set, or null.
   */
  public setActive(id: string | null): void {
    this._store.setActive(id);
  }
}
