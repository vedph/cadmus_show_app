import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { PaginationResponse, PaginatorPlugin } from '@datorama/akita';
import {
  ComponentSignal,
  ThesaurusEntry,
} from 'projects/myrmidon/cadmus-profile-core/src/public-api';
import { DataPage } from 'projects/myrmidon/cadmus-shop-core/src/public-api';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { debounceTime, map, startWith, switchMap, tap } from 'rxjs/operators';
import { RamThesaurusService } from '../../services/ram-thesaurus.service';
import {
  ThesaurusNode,
  ThesaurusNodeFilter,
  ThesaurusNodesService,
} from '../../services/thesaurus-nodes.service';
import { THESAURUS_EDITOR_PAGINATOR } from './store/thesaurus-editor.paginator';
import { ThesaurusEditorState } from './store/thesaurus-editor.store';

/**
 * Thesaurus editor. This edits a thesaurus per pages. Each page
 * contains a set of thesauri nodes, which are a representation of
 * thesaurus entries used to ease facilitate the editing of hierarchical
 * thesauri, but can be equally used with normal thesauri.
 */
@Component({
  selector: 'cadmus-thesaurus-editor',
  templateUrl: './thesaurus-editor.component.html',
  styleUrls: ['./thesaurus-editor.component.css'],
})
export class ThesaurusEditorComponent implements OnInit {
  private _id: string;

  private _refresh$: BehaviorSubject<number>;
  public filter$: BehaviorSubject<ThesaurusNodeFilter>;
  public pageSize: FormControl;
  // filter
  public parentId: FormControl;
  public idOrValue: FormControl;
  public form: FormGroup;

  public parentIds$: Observable<ThesaurusEntry[]>;
  public page$: Observable<PaginationResponse<ThesaurusNode>> | undefined;

  constructor(
    @Inject(THESAURUS_EDITOR_PAGINATOR)
    public paginator: PaginatorPlugin<ThesaurusEditorState>,
    private _nodesService: ThesaurusNodesService,
    private _thesService: RamThesaurusService,
    private _router: Router,
    private _route: ActivatedRoute,
    formBuilder: FormBuilder
  ) {
    // get the edited thesaurus ID from the route
    this._id = this._route.snapshot.params.id;
    if (this._id === 'new') {
      this._id = '';
    }

    this.filter$ = new BehaviorSubject<ThesaurusNodeFilter>({
      pageNumber: 1,
      pageSize: 20,
    });
    this._refresh$ = new BehaviorSubject(0);
    this.pageSize = formBuilder.control(20);
    // the list of all the parent nodes IDs in the edited thesaurus
    this.parentIds$ = this._nodesService.selectParentIds();
    // filter form
    this.idOrValue = formBuilder.control(null);
    this.parentId = formBuilder.control(null);
    this.form = formBuilder.group({
      idOrValue: this.idOrValue,
      parentId: this.parentId,
    });
  }

  private refresh(): void {
    let n = this._refresh$.value + 1;
    if (n > 100) {
      n = 1;
    }
    this._refresh$.next(n);
  }

  private loadThesaurus(): void {
    this._thesService.get(this._id).subscribe((thesaurus) => {
      if (!thesaurus) {
        thesaurus = {
          id: this._id || 'new-thesaurus',
          language: 'en',
        };
      }
      const entries: ThesaurusEntry[] = [];
      thesaurus.entries?.forEach((e) => {
        entries.push({ ...e });
      });
      this._nodesService.importEntries(entries);
      this.refresh();
    });
  }

  private getRequest(
    filter: ThesaurusNodeFilter
  ): () => Observable<PaginationResponse<ThesaurusNode>> {
    return () =>
      this._nodesService.getPage(filter).pipe(
        // adapt page to paginator plugin
        map((p: DataPage<ThesaurusNode>) => {
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
    pageSize: number
  ): Observable<PaginationResponse<ThesaurusNode>> {
    const filter = {
      ...this.filter$.value,
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
      switchMap(([pageNumber, pageSize, _]) => {
        return this.getPaginatorResponse(pageNumber, pageSize);
      })
    );

    // load
    this.loadThesaurus();
  }

  public pageChanged(event: PageEvent): void {
    // https://material.angular.io/components/paginator/api
    this.paginator.setPage(event.pageIndex + 1);
    if (event.pageSize !== this.pageSize.value) {
      this.pageSize.setValue(event.pageSize);
    }
  }

  public applyFilter(): void {
    this.filter$.next({
      pageNumber: 1,
      pageSize: 20,
      idOrValue: this.idOrValue.value,
      parentId: this.parentId.value,
    });
  }

  public addNode(node: ThesaurusNode): void {
    this._nodesService.add(node);
    this.refresh();
  }

  public onSignal(signal: ComponentSignal<ThesaurusNode>): void {
    const node = signal.payload as ThesaurusNode;
    switch (signal.id) {
      case 'expand':
        node.expanded = true;
        this._nodesService.add(node);
        this.refresh();
        break;
      case 'collapse':
        node.expanded = false;
        this._nodesService.add(node);
        this.refresh();
        break;
      // TODO
    }
  }
}
