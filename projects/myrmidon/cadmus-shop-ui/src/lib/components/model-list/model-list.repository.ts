import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  combineLatest,
  debounceTime,
  map,
  Observable,
  take,
} from 'rxjs';

import { createStore, select, withProps } from '@ngneat/elf';
import {
  withEntities,
  withActiveId,
  selectActiveEntity,
  upsertEntities,
  deleteAllEntities,
} from '@ngneat/elf-entities';
import {
  withRequestsCache,
  withRequestsStatus,
  updateRequestStatus,
  selectRequestStatus,
  StatusState,
} from '@ngneat/elf-requests';
import {
  deleteAllPages,
  hasPage,
  PaginationData,
  selectCurrentPageEntities,
  selectPaginationData,
  setCurrentPage,
  setPage,
  updatePaginationData,
  withPagination,
} from '@ngneat/elf-pagination';
import { DataPage } from '@myrmidon/ng-tools';
import { CadmusModel, CadmusModelFilter } from '@myrmidon/cadmus-shop-core';
import { CadmusShopAssetService } from '@myrmidon/cadmus-shop-asset';

const PAGE_SIZE = 20;

export interface CadmusModelListProps {
  filter: CadmusModelFilter;
}

@Injectable({ providedIn: 'root' })
export class ModelListRepository {
  private _store;
  private _lastPageSize: number;
  private _loading$: BehaviorSubject<boolean>;

  public activeCadmusModel$: Observable<CadmusModel | undefined>;
  public filter$: Observable<CadmusModelFilter>;
  public pagination$: Observable<PaginationData & { data: CadmusModel[] }>;
  public status$: Observable<StatusState>;
  public loading$: Observable<boolean>;

  constructor(private _assetService: CadmusShopAssetService) {
    // create store
    this._store = this.createStore();
    this._lastPageSize = PAGE_SIZE;
    this._loading$ = new BehaviorSubject<boolean>(false);
    this.loading$ = this._loading$.asObservable();

    // combine pagination parameters with page data for our consumers
    this.pagination$ = combineLatest([
      this._store.pipe(selectPaginationData()),
      this._store.pipe(selectCurrentPageEntities()),
    ]).pipe(
      map(([pagination, data]) => ({ ...pagination, data })),
      debounceTime(0)
    );

    this.activeCadmusModel$ = this._store.pipe(selectActiveEntity());
    this.filter$ = this._store.pipe(select((state) => state.filter));

    this.filter$.subscribe((filter) => {
      // when filter changed, reset any existing page and move to page 1
      const paginationData = this._store.getValue().pagination;
      console.log('Deleting all pages');
      this._store.update(deleteAllPages());
      this.loadPage(1, paginationData.perPage);
    });

    // the request status
    this.status$ = this._store.pipe(selectRequestStatus('model-list'));

    // load page 1 and subscribe to pagination
    this.loadPage(1, PAGE_SIZE);
    this.pagination$.subscribe(console.log);
  }

  private createStore(): typeof store {
    const store = createStore(
      { name: 'document' },
      withProps<CadmusModelListProps>({
        filter: {},
      }),
      // should you have an id property different from 'id'
      // use like withEntities<User, 'userName'>({ idKey: 'userName' })
      withEntities<CadmusModel>(),
      withActiveId(),
      withRequestsCache<'model-list'>(),
      withRequestsStatus(),
      withPagination()
    );

    return store;
  }

  private adaptPage(
    page: DataPage<CadmusModel>
  ): PaginationData & { data: CadmusModel[] } {
    // adapt the server page DataPage<T> to Elf pagination
    return {
      currentPage: page.pageNumber,
      perPage: page.pageSize,
      lastPage: page.pageCount,
      total: page.total,
      data: page.items,
    };
  }

  private addPage(response: PaginationData & { data: CadmusModel[] }): void {
    const { data, ...paginationData } = response;
    this._store.update(
      upsertEntities(data),
      updatePaginationData(paginationData),
      setPage(
        paginationData.currentPage,
        data.map((c) => c.id)
      )
    );
  }

  public loadPage(pageNumber: number, pageSize?: number): void {
    if (!pageSize) {
      pageSize = PAGE_SIZE;
    }
    // if the page exists and page size is the same, just move to it
    if (
      this._store.query(hasPage(pageNumber)) &&
      pageSize === this._lastPageSize
    ) {
      console.log('Page exists: ' + pageNumber);
      this._store.update(setCurrentPage(pageNumber));
      return;
    }

    this._loading$.next(true);

    // reset cached pages if page size changed
    if (this._lastPageSize !== pageSize) {
      this._store.update(deleteAllPages());
      this._lastPageSize = pageSize;
    }

    // load page from server
    const filter = this._store.query((state) => state.filter);
    this._store.update(updateRequestStatus('model-list', 'pending'));
    this._assetService
      .getModels(filter, pageNumber, pageSize)
      .pipe(take(1))
      .subscribe({
        next: (page) => {
          this._loading$.next(false);
          this.addPage({ ...this.adaptPage(page), data: page.items });
          this._store.update(updateRequestStatus('model-list', 'success'));
        },
        error: (error) => {
          this._loading$.next(false);
        },
      });
  }

  public setFilter(filter: CadmusModelFilter): void {
    this._store.update((state) => ({ ...state, filter: filter }));
  }

  clearCache() {
    this._store.update(deleteAllEntities(), deleteAllPages());
  }
}
