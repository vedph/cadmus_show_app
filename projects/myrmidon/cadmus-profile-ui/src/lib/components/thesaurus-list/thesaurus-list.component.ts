import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { PaginationResponse, PaginatorPlugin } from '@datorama/akita';
import {
  Thesaurus,
  ThesaurusFilter,
} from 'projects/myrmidon/cadmus-profile-core/src/public-api';
import { DialogService } from 'projects/myrmidon/cadmus-show-ui/src/public-api';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { startWith, switchMap, tap } from 'rxjs/operators';
import { ThesaurusFilterQuery } from '../thesaurus-filter/store/thesaurus-filter.query';
import { ThesaurusFilterService } from '../thesaurus-filter/store/thesaurus-filter.service';
import { THESAURUS_LIST_PAGINATOR } from './store/thesaurus-list.paginator';
import { ThesaurusListQuery } from './store/thesaurus-list.query';
import { ThesaurusListService } from './store/thesaurus-list.service';
import { ThesaurusListState } from './store/thesaurus-list.store';

@Component({
  selector: 'cadmus-thesaurus-list',
  templateUrl: './thesaurus-list.component.html',
  styleUrls: ['./thesaurus-list.component.css'],
})
export class ThesaurusListComponent implements OnInit {
  public pagination$: Observable<PaginationResponse<Thesaurus>> | undefined;
  public filter$: Observable<ThesaurusFilter | undefined>;
  public pageSize: FormControl;

  constructor(
    @Inject(THESAURUS_LIST_PAGINATOR)
    public paginator: PaginatorPlugin<ThesaurusListState>,
    private _tlQuery: ThesaurusListQuery,
    private _tlService: ThesaurusListService,
    private _tfService: ThesaurusFilterService,
    private _dialogService: DialogService,
    tfQuery: ThesaurusFilterQuery,
    formBuilder: FormBuilder
  ) {
    this.filter$ = tfQuery.select();
    this.pageSize = formBuilder.control(20);
  }

  private getRequest(
    filter?: ThesaurusFilter
  ): () => Observable<PaginationResponse<Thesaurus>> {
    return () => {
      const page = filter
        ? this._tlQuery.getPage(filter)
        : {
            pageNumber: 1,
            pageSize: 20,
            pageCount: 0,
            total: 0,
            items: [],
          };
      const response: PaginationResponse<Thesaurus> = {
        currentPage: page.pageNumber,
        perPage: page.pageSize,
        lastPage: page.pageCount,
        data: page.items,
        total: page.total,
      };
      return of(response);
    };
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
    // -filter changes from filter (in this case, clearing the cache).
    this.pagination$ = combineLatest([
      this.paginator.pageChanges,
      this.pageSize.valueChanges.pipe(
        // we are required to emit at least the initial value
        // as combineLatest emits only if ALL observables have emitted
        startWith(initialPageSize),
        // clear the cache when page size changes
        tap((_) => {
          console.log(this._tlQuery.getCount());
          this.paginator.clearCache();
        })
      ),
      this.filter$.pipe(
        // clear the cache when filters changed
        tap((_) => {
          console.log(this._tlQuery.getCount());
          this.paginator.clearCache();
        })
      ),
    ]).pipe(
      // for each emitted value, combine into a filter and use it
      // to request the page from server
      switchMap(([pageNumber, pageSize, filter]) => {
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
        this._tlService.deleteThesaurus(id);
      });
  }
}
