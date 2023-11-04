import { Injectable, Optional } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { FlagDefinition } from '@myrmidon/cadmus-core';
import { FlagService } from '@myrmidon/cadmus-api';

@Injectable({ providedIn: 'root' })
export class FlagListRepository {
  private _flags$: BehaviorSubject<FlagDefinition[]>;
  private _activeFlag$: BehaviorSubject<FlagDefinition | null>;
  private _busy$: BehaviorSubject<boolean>;

  public get flags$(): Observable<FlagDefinition[]> {
    return this._flags$.asObservable();
  }
  public get activeFlag$(): Observable<FlagDefinition | null> {
    return this._activeFlag$.asObservable();
  }
  public get busy$(): Observable<boolean> {
    return this._busy$.asObservable();
  }

  constructor(@Optional() private _flagService: FlagService) {
    this._flags$ = new BehaviorSubject<FlagDefinition[]>([]);
    this._activeFlag$ = new BehaviorSubject<FlagDefinition | null>(null);
    this._busy$ = new BehaviorSubject<boolean>(false);
    this.reset();
  }

  public reset(flags?: FlagDefinition[]): void {
    this._activeFlag$.next(null);
    this._flags$.next(flags || []);
  }

  public getFlags(): FlagDefinition[] {
    return this._flags$.value || [];
  }

  public save(): void {
    this._busy$.next(true);
    // TODO
    // this._flagService.addFlags
  }

  private getNextId(): number {
    const ids = this._flags$.value.map((d) => d.id) || [];

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
   * Add a new flag definition to the list.
   *
   * @returns The ID of the new flag definition or 0 if no more flags
   * available.
   */
  public addNewFlag(): number {
    const id = this.getNextId();
    if (!id) {
      return 0;
    }
    const def: FlagDefinition = {
      id: id,
      label: id.toString(),
      description: '',
      colorKey: 'f00000',
    };
    this._flags$.next([...this._flags$.value, def]);
    return id;
  }

  /**
   * Delete the flag with the specified ID.
   *
   * @param id The flag's ID.
   */
  public deleteFlag(id: number): void {
    this._flags$.next(
      this._flags$.value.filter((f) => {
        return f.id !== id;
      })
    );
  }

  /**
   * Update the specified flag in the store.
   *
   * @param flag The updated flag.
   */
  public updateFlag(flag: FlagDefinition): void {
    const flags = [...this._flags$.value];
    const i = flags.findIndex((f) => {
      return f.id === flag.id;
    });
    if (i > -1) {
      flags.splice(i, 1, flag);
      this._flags$.next(flags);
    } else {
      this._flags$.next([...flags, flag]);
    }
  }

  /**
   * Set the active flag.
   *
   * @param id The ID of the flag to set, or null.
   */
  public setActive(id: number | null): void {
    const flag = this._flags$.value.find((f) => {
      return f.id === id;
    });
    this._activeFlag$.next(flag || null);
  }
}
