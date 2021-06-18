import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { PaginationResponse, PaginatorPlugin } from '@datorama/akita';
import { Thesaurus } from '@myrmidon/cadmus-core';
import { ThesaurusFilter } from '@myrmidon/cadmus-core';
import { DataPage } from '@myrmidon/cadmus-shop-core';
import { DialogService } from '@myrmidon/cadmus-show-ui';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import {
  debounceTime,
  map,
  startWith,
  switchMap,
  take,
  tap,
} from 'rxjs/operators';
import { RamThesaurusService } from '../../services/ram-thesaurus.service';
import { ThesaurusFilterQuery } from '../thesaurus-filter/store/thesaurus-filter.query';
import { ThesaurusFilterService } from '../thesaurus-filter/store/thesaurus-filter.service';
import { THESAURUS_LIST_PAGINATOR } from './store/thesaurus-list.paginator';
import { ThesaurusListState } from './store/thesaurus-list.store';

/**
 * Thesauri list component. This is a paged list; so, the corresponding
 * store does not represent the full list of thesauri (which would take
 * too much space), but rather a single page from it, selected according
 * to the values in the thesaurus filter store. So, the entity store
 * for this component just holds the thesauri found in a single page.
 *
 * A paginator factory, depending on its query, is used to inject the
 * paginator into this component. The paginator uses a request function
 * to fetch data for its page from some service (here, the RAM-based list
 * of thesauri). This request is triggered by a change in the paging
 * parameters (number/size); a change in the filter; or a refresh request
 * (e.g. when a thesaurus is deleted).
 *
 * Whenever the request is triggered, it gets the current filter value,
 * updates its page number and size from the controls, creates a fetch
 * request with this filter, and invokes the paginator's getPage function.
 * This either gets the page from its cache, or invokes the request
 * function.
 */
@Component({
  selector: 'cadmus-thesaurus-list',
  templateUrl: './thesaurus-list.component.html',
  styleUrls: ['./thesaurus-list.component.css'],
})
export class ThesaurusListComponent implements OnInit {
  private _refresh$: BehaviorSubject<number>;
  public page$: Observable<PaginationResponse<Thesaurus>> | undefined;
  public filter$: Observable<ThesaurusFilter | undefined>;
  public pageSize: FormControl;

  constructor(
    // the paginator factory
    @Inject(THESAURUS_LIST_PAGINATOR)
    public paginator: PaginatorPlugin<ThesaurusListState>,
    // the service with the full thesauri list
    private _thesService: RamThesaurusService,
    // services related to the filter store
    private _filterService: ThesaurusFilterService,
    private _filterQuery: ThesaurusFilterQuery,
    private _dialogService: DialogService,
    private _router: Router,
    formBuilder: FormBuilder
  ) {
    this.pageSize = formBuilder.control(20);
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
    filter: ThesaurusFilter
  ): () => Observable<PaginationResponse<Thesaurus>> {
    return () =>
      this._thesService.getPage(filter).pipe(
        // adapt page to paginator plugin
        map((p: DataPage<Thesaurus>) => {
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
  ): Observable<PaginationResponse<Thesaurus>> {
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

    this.refresh();
  }

  public onFilterChange(filter: ThesaurusFilter): void {
    this._filterService.setFilter(filter);
  }

  public pageChanged(event: PageEvent): void {
    // https://material.angular.io/components/paginator/api
    this.paginator.setPage(event.pageIndex + 1);
    if (event.pageSize !== this.pageSize.value) {
      this.pageSize.setValue(event.pageSize);
    }
  }

  public addThesaurus(): void {
    this._router.navigate(['/thes/new']);
  }

  public editThesaurus(id: string): void {
    this._router.navigate([`/thes/${id}`]);
  }

  private refresh(): void {
    let n = this._refresh$.value + 1;
    if (n > 100) {
      n = 1;
    }
    this._refresh$.next(n);
  }

  public deleteThesaurus(id: string): void {
    this._dialogService
      .confirm('Confirm Deletion', `Delete thesaurus "${id}"?`)
      .subscribe((ok: boolean) => {
        if (!ok) {
          return;
        }
        this._thesService
          .deleteThesaurus(id)
          .pipe(take(1))
          .subscribe((_) => {
            this.refresh();
          });
      });
  }
}
