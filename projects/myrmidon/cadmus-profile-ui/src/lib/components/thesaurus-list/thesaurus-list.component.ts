import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { PaginationResponse, PaginatorPlugin } from '@datorama/akita';
import {
  Thesaurus,
  ThesaurusFilter,
} from 'projects/myrmidon/cadmus-profile-core/src/public-api';
import { DataPage } from 'projects/myrmidon/cadmus-shop-core/src/public-api';
import { DialogService } from 'projects/myrmidon/cadmus-show-ui/src/public-api';
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
    @Inject(THESAURUS_LIST_PAGINATOR)
    public paginator: PaginatorPlugin<ThesaurusListState>,
    private _thesService: RamThesaurusService,
    private _tfService: ThesaurusFilterService,
    private _dialogService: DialogService,
    tfQuery: ThesaurusFilterQuery,
    formBuilder: FormBuilder
  ) {
    this.pageSize = formBuilder.control(20);
    this.filter$ = tfQuery.select();
    this._refresh$ = new BehaviorSubject(0);
  }

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

  private getPaginatorResponse(
    pageNumber: number,
    pageSize: number,
    filter: ThesaurusFilter | undefined
  ): Observable<PaginationResponse<Thesaurus>> {
    if (filter) {
      filter.pageNumber = pageNumber;
      filter.pageSize = pageSize;
    } else {
      filter = {
        pageNumber: pageNumber,
        pageSize: pageSize,
      };
    }
    const request = this.getRequest(filter);
    // update saved filters
    this.paginator.metadata.set('filter', filter);

    return this.paginator.getPage(request);
  }

  ngOnInit(): void {
    // filter
    const initialPageSize = 20;
    this.filter$ = new BehaviorSubject<ThesaurusFilter>(
      this.paginator.metadata.get('filter') || {
        pageNumber: 1,
        pageSize: initialPageSize,
      }
    );
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
        startWith(undefined),
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
      switchMap(([pageNumber, pageSize, filter]) => {
        return this.getPaginatorResponse(pageNumber, pageSize, filter);
      })
    );
  }

  public onFilterChange(event: ThesaurusFilter): void {
    this._tfService.setFilter(event);
  }

  public pageChanged(event: PageEvent): void {
    // https://material.angular.io/components/paginator/api
    this.paginator.setPage(event.pageIndex + 1);
    if (event.pageSize !== this.pageSize.value) {
      this.pageSize.setValue(event.pageSize);
    }
  }

  public addThesaurus(): void {
    // TODO
  }

  public editThesaurus(id: string): void {
    // TODO
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
            let n = this._refresh$.value + 1;
            if (n > 100) {
              n = 1;
            }
            this._refresh$.next(n);
          });
      });
  }
}
