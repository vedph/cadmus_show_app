import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { PaginationResponse, PaginatorPlugin } from '@datorama/akita';
import { CadmusShopAssetService } from 'projects/myrmidon/cadmus-shop-asset/src/public-api';
import {
  CadmusModel,
  CadmusModelFilter,
  DataPage,
} from 'projects/myrmidon/cadmus-shop-core/src/public-api';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { debounceTime, map, startWith, switchMap, tap } from 'rxjs/operators';
import { ModelFilterQuery } from '../model-filter/store/model-filter.query';
import { ModelFilterService } from '../model-filter/store/model-filter.service';
import { MODEL_LIST_PAGINATOR } from './store/model-list.paginator';
import { ModelListState } from './store/model-list.store';

@Component({
  selector: 'cadmus-model-list',
  templateUrl: './model-list.component.html',
  styleUrls: ['./model-list.component.css'],
})
export class ModelListComponent implements OnInit {
  private _refresh$: BehaviorSubject<number>;
  public page$: Observable<PaginationResponse<CadmusModel>> | undefined;
  public filter$: Observable<CadmusModelFilter | undefined>;
  public pageSize: FormControl;
  public fragment: FormControl;

  constructor(
    // the paginator factory
    @Inject(MODEL_LIST_PAGINATOR)
    public paginator: PaginatorPlugin<ModelListState>,
    private _assetService: CadmusShopAssetService,
    // services related to the filter store
    private _filterService: ModelFilterService,
    private _filterQuery: ModelFilterQuery,
    formBuilder: FormBuilder
  ) {
    this.pageSize = formBuilder.control(20);
    this.fragment = formBuilder.control(false);
    this.filter$ = _filterQuery.select();
    this._refresh$ = new BehaviorSubject(0);
  }

  /**
   * Return a request function used to fetch data for
   * the page specified by filter.
   *
   * @param filter The filter with paging and filtering data.
   */
  private getRequest(
    filter: CadmusModelFilter
  ): () => Observable<PaginationResponse<CadmusModel>> {
    return () =>
      this._assetService.getModels(filter, this.fragment.value).pipe(
        // adapt page to paginator plugin
        map((p: DataPage<CadmusModel>) => {
          return {
            currentPage: p.pageNumber,
            perPage: p.pageSize,
            lastPage: p.pageCount,
            data: p.items,
            total: p.total,
          };
        })
      );
  }

  /**
   * Get the paginator response from its cache or from the
   * underlying service. The filter is got from the filter
   * state, and updated with paging parameters.
   *
   * @param pageNumber The page number.
   * @param pageSize The page size.
   */
  private getPaginatorResponse(
    pageNumber: number,
    pageSize: number
  ): Observable<PaginationResponse<CadmusModel>> {
    const filter = {
      ...this._filterQuery.getValue(),
      pageNumber: pageNumber,
      pageSize: pageSize,
    };
    const request = this.getRequest(filter);
    // update saved filters
    this.paginator.metadata.set('filter', filter);

    return this.paginator.getPage(request);
  }

  ngOnInit(): void {
    // filter
    const initialPageSize = 20;
    this.pageSize.setValue(initialPageSize);

    // combine and get latest:
    // -page number changes from paginator;
    // -page size changes from control;
    // -filter changes from filter (in this case, clearing the cache);
    // -refresh request (in this case, clearing the cache).
    this.page$ = combineLatest([
      this.paginator.pageChanges.pipe(startWith(0)),
      this.pageSize.valueChanges.pipe(
        // we are required to emit at least the initial value
        // as combineLatest emits only if ALL observables have emitted
        startWith(initialPageSize),
        // clear the cache when page size changes
        tap((_) => {
          this.paginator.clearCache();
        })
      ),
      this.filter$.pipe(
        // startWith(undefined),
        // clear the cache when filters changed
        tap((_) => {
          this.paginator.clearCache();
        })
      ),
      this._refresh$.pipe(
        // clear the cache when forcing refresh
        tap((_) => {
          this.paginator.clearCache();
        })
      ),
    ]).pipe(
      // https://blog.strongbrew.io/combine-latest-glitch/
      debounceTime(0),
      // for each emitted value, combine into a filter and use it
      // to request the page from server
      switchMap(([pageNumber, pageSize, _]) => {
        return this.getPaginatorResponse(pageNumber, pageSize);
      })
    );
  }

  public onFilterChange(filter: CadmusModelFilter): void {
    this._filterService.setFilter(filter);
  }

  public pageChanged(event: PageEvent): void {
    // https://material.angular.io/components/paginator/api
    this.paginator.setPage(event.pageIndex + 1);
    if (event.pageSize !== this.pageSize.value) {
      this.pageSize.setValue(event.pageSize);
    }
  }
}
