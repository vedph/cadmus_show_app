import { Injectable } from '@angular/core';
import { FlagDefinition } from 'projects/myrmidon/cadmus-profile-core/src/public-api';
import { FlagListQuery } from './flag-list.query';
import { FlagListStore } from './flag-list.store';

/**
 * Service used to write data into the flags list store.
 */
@Injectable({
  providedIn: 'root',
})
export class FlagListService {
  constructor(private _store: FlagListStore, private _query: FlagListQuery) {}

  /**
   * Set all the flags.
   *
   * @param flags The flags to set.
   */
  public set(flags: FlagDefinition[]): void {
    this._store.set(flags);
  }

  private getNextId(): number {
    const ids = this._store.getValue().ids || [];

    for (let i = 0; i < 32; i++) {
      const testId = 1 << i;
      if (
        ids.findIndex((id) => {
          return testId === id;
        }) === -1
      ) {
        return testId;
      }
    }
    return 0;
  }

  /**
   * Add a new flag.
   *
   * @returns The new flag's ID, or 0 if no more flags available.
   */
  public addFlag(): number {
    const id = this.getNextId();
    if (!id) {
      return 0;
    }
    const flag = this._query.getEntity(id);
    if (!flag) {
      this._store.add({
        id: id,
        label: id.toString(),
        description: '',
        colorKey: 'f00000',
      });
    }
    this._store.setActive(id);
    return id;
  }

  /**
   * Delete the flag with the specified ID.
   *
   * @param id The flag's ID.
   */
  public deleteFlag(id: number): void {
    this._store.remove(id);
  }

  /**
   * Update the specified flag in the store.
   *
   * @param flag The updated flag.
   */
  public updateFlag(flag: FlagDefinition): void {
    this._store.upsert(flag.id, flag);
  }

  /**
   * Set the active flag.
   *
   * @param id The ID of the flag to set, or null.
   */
  public setActive(id: number | null): void {
    this._store.setActive(id);
  }
}
