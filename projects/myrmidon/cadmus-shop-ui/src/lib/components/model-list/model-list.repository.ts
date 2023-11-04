import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';

import { DataPage } from '@myrmidon/ng-tools';
import { CadmusModel, CadmusModelFilter } from '@myrmidon/cadmus-shop-core';
import { PagedListStore } from '@myrmidon/paged-data-browsers';

import { CadmusShopAssetService } from '@myrmidon/cadmus-shop-asset';

@Injectable({ providedIn: 'root' })
export class ModelListRepository {
  private readonly _store: PagedListStore<CadmusModelFilter, CadmusModel>;
  private _loading$: BehaviorSubject<boolean>;

  public get loading$(): Observable<boolean> {
    return this._loading$.asObservable();
  }
  public get page$(): Observable<DataPage<CadmusModel>> {
    return this._store.page$;
  }

  constructor(private _assetService: CadmusShopAssetService) {
    this._store = new PagedListStore<CadmusModelFilter, CadmusModel>(this);
    this._loading$ = new BehaviorSubject<boolean>(false);
    this._store.reset();
  }

  public loadPage(
    pageNumber: number,
    pageSize: number,
    filter: CadmusModelFilter
  ): Observable<DataPage<CadmusModel>> {
    this._loading$.next(true);
    return this._assetService.getModels(filter, pageNumber, pageSize).pipe(
      tap({
        next: () => this._loading$.next(false),
        error: () => this._loading$.next(false),
      })
    );
  }

  public async reset(): Promise<void> {
    this._loading$.next(true);
    try {
      await this._store.reset();
    } catch (error) {
      throw error;
    } finally {
      this._loading$.next(false);
    }
  }

  public async setFilter(filter: CadmusModelFilter): Promise<void> {
    this._loading$.next(true);
    try {
      await this._store.setFilter(filter);
    } catch (error) {
      throw error;
    } finally {
      this._loading$.next(false);
    }
  }

  public getFilter(): CadmusModelFilter {
    return this._store.getFilter();
  }

  public async setPage(pageNumber: number, pageSize: number): Promise<void> {
    this._loading$.next(true);
    try {
      await this._store.setPage(pageNumber, pageSize);
    } catch (error) {
      throw error;
    } finally {
      this._loading$.next(false);
    }
  }
}
