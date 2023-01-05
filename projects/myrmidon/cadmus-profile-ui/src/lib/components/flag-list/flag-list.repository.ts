import { Injectable } from '@angular/core';
import { FlagDefinition } from '@myrmidon/cadmus-core';
import { createStore } from '@ngneat/elf';

import {
  addEntities,
  deleteEntities,
  getAllEntities,
  getEntitiesCount,
  getEntity,
  selectAllEntities,
  setActiveId,
  setEntities,
  upsertEntities,
  withActiveId,
  withEntities,
} from '@ngneat/elf-entities';

import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FlagListRepository {
  private _store;

  public flags$: Observable<FlagDefinition[]>;

  constructor() {
    this._store = this.createStore();
    this.flags$ = this._store.pipe(selectAllEntities());
  }

  private createStore(): typeof store {
    const store = createStore(
      { name: 'flag-list' },
      withEntities<FlagDefinition>(),
      withActiveId()
    );
    return store;
  }

  public getAll(): FlagDefinition[] {
    return this._store.query(getAllEntities());
  }

  public getCount(): number {
    return this._store.query(getEntitiesCount());
  }

  /**
   * Set all the flags.
   *
   * @param flags The flags to set.
   */
  public setFlags(flags: FlagDefinition[]): void {
    this._store.update(setEntities(flags));
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
    const flag = this._store.query(getEntity(id));
    if (!flag) {
      this._store.update(
        addEntities({
          id: id,
          label: id.toString(),
          description: '',
          colorKey: 'f00000',
        })
      );
    }
    this._store.update(setActiveId(id));
    return id;
  }

  /**
   * Delete the flag with the specified ID.
   *
   * @param id The flag's ID.
   */
  public deleteFlag(id: number): void {
    this._store.update(deleteEntities(id));
  }

  /**
   * Update the specified flag in the store.
   *
   * @param flag The updated flag.
   */
  public updateFlag(flag: FlagDefinition): void {
    this._store.update(upsertEntities(flag));
  }

  /**
   * Set the active flag.
   *
   * @param id The ID of the flag to set, or null.
   */
  public setActive(id: number | null): void {
    this._store.update(setActiveId(id));
  }
}
