import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { PaginationResponse, PaginatorPlugin } from '@datorama/akita';
import { Thesaurus, ThesaurusEntry } from '@myrmidon/cadmus-core';
import { ComponentSignal } from '@myrmidon/cadmus-profile-core';
import { DataPage } from '@myrmidon/cadmus-shop-core';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { debounceTime, map, startWith, switchMap, tap } from 'rxjs/operators';
import { LookupThesaurusEntry } from '../../services/ram-thesaurus.service';
import {
  ThesaurusNode,
  ThesaurusNodeFilter,
  ThesaurusNodesService,
} from '../../services/thesaurus-nodes.service';
import { THESAURUS_EDITOR_PAGINATOR } from './store/thesaurus-editor.paginator';
import { ThesaurusEditorState } from './store/thesaurus-editor.store';

const THES_ID_PATTERN = '^[a-zA-Z0-9][.-_a-zA-Z0-9]*@[a-z]{2}$';

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
  private _thesaurus: Thesaurus | undefined;
  private _refresh$: BehaviorSubject<number>;

  @Input()
  public get thesaurus(): Thesaurus | undefined {
    return this._thesaurus;
  }
  public set thesaurus(value: Thesaurus | undefined) {
    this._thesaurus = value;
    this.updateForm(value);
  }

  @Output()
  public thesaurusChange: EventEmitter<Thesaurus>;

  @Output()
  public editorClose: EventEmitter<any>;

  public filter$: BehaviorSubject<ThesaurusNodeFilter>;
  public pageSize: FormControl;

  // thesaurus form
  public id: FormControl;
  public alias: FormControl;
  public targetId: FormControl;
  public entryCount: FormControl;
  public form: FormGroup;

  // filter
  public parentId: FormControl;
  public idOrValue: FormControl;
  public filterForm: FormGroup;

  public parentIds$: Observable<ThesaurusEntry[]>;
  public page$: Observable<PaginationResponse<ThesaurusNode>> | undefined;

  constructor(
    @Inject(THESAURUS_EDITOR_PAGINATOR)
    public paginator: PaginatorPlugin<ThesaurusEditorState>,
    private _nodesService: ThesaurusNodesService,
    formBuilder: FormBuilder
  ) {
    this.filter$ = new BehaviorSubject<ThesaurusNodeFilter>({
      pageNumber: 1,
      pageSize: 20,
    });
    this._refresh$ = new BehaviorSubject(0);
    this.pageSize = formBuilder.control(20);
    this.thesaurusChange = new EventEmitter<Thesaurus>();
    this.editorClose = new EventEmitter<any>();
    // the list of all the parent nodes IDs in the edited thesaurus
    this.parentIds$ = this._nodesService.selectParentIds();
    // thesaurus form
    this.id = formBuilder.control(null, [
      Validators.required,
      Validators.maxLength(50),
      Validators.pattern(new RegExp(THES_ID_PATTERN)),
    ]);
    this.alias = formBuilder.control(false);
    this.targetId = formBuilder.control(null);
    this.entryCount = formBuilder.control(0, Validators.min(1));
    this.form = formBuilder.group({
      id: this.id,
      alias: this.alias,
      targetId: this.targetId,
      entryCount: this.entryCount,
    });
    // filter form
    this.idOrValue = formBuilder.control(null);
    this.parentId = formBuilder.control(null);
    this.filterForm = formBuilder.group({
      idOrValue: this.idOrValue,
      parentId: this.parentId,
    });
  }

  /**
   * Update the form's validators according to whether the edited
   * thesaurus is just an alias or a full thesaurus.
   */
  private updateValidators(): void {
    if (this.alias.value) {
      // alias: target ID required and valid, no entries
      this.entryCount.setValidators(null);
      this.targetId.setValidators([
        Validators.required,
        Validators.maxLength(50),
        Validators.pattern(new RegExp(THES_ID_PATTERN)),
      ]);
    } else {
      // not an alias: entries required, no target ID
      this.entryCount.setValidators(Validators.min(1));
      this.targetId.setValidators(null);
    }

    this.entryCount.updateValueAndValidity();
    this.targetId.updateValueAndValidity();
  }

  private refresh(): void {
    let n = this._refresh$.value + 1;
    if (n > 100) {
      n = 1;
    }
    this._refresh$.next(n);
    this.entryCount.setValue(this._nodesService.length);
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
        // clear the cache when filters change
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

    // change validation according to whether this is an alias
    this.alias.valueChanges.subscribe((_) => {
      this.updateValidators();
    });

    // load
    if (this._thesaurus) {
      this.updateForm(this._thesaurus);
    }
  }

  public onTargetIdChange(targetId: LookupThesaurusEntry | null): void {
    this.targetId.setValue(targetId?.id);
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

  public expandAll(): void {
    this._nodesService.toggleAll(false);
    this.refresh();
  }

  public collapseAll(): void {
    this._nodesService.toggleAll(true);
    this.refresh();
  }

  public onSignal(signal: ComponentSignal<ThesaurusNode>): void {
    const node = signal.payload as ThesaurusNode;
    switch (signal.id) {
      case 'expand':
        node.collapsed = false;
        this._nodesService.add(node);
        this.refresh();
        break;
      case 'collapse':
        node.collapsed = true;
        this._nodesService.add(node);
        this.refresh();
        break;
      case 'move-up':
        this._nodesService.moveUp(node.id);
        this.refresh();
        break;
      case 'move-down':
        this._nodesService.moveDown(node.id);
        this.refresh();
        break;
      case 'delete':
        this._nodesService.delete(node.id);
        this.refresh();
        break;
    }
  }

  private updateForm(thesaurus?: Thesaurus): void {
    if (!thesaurus) {
      this.form.reset();
      return;
    }
    this.id.setValue(thesaurus.id);
    this.targetId.setValue(thesaurus.targetId);
    this.entryCount.setValue(thesaurus.entries?.length || 0);
    this.alias.setValue(thesaurus.targetId? true : false);
    this.form.markAsPristine();

    // nodes
    const entries: ThesaurusEntry[] = [];
    thesaurus.entries?.forEach((e: ThesaurusEntry) => {
      entries.push({ ...e });
    });
    this._nodesService.importEntries(entries);
    this.refresh();
  }

  private getThesaurus(): Thesaurus {
    const thesaurus: Thesaurus = {
      id: this.id.value,
      language: 'en',
      entries: [],
    };

    if (this.alias.value) {
      thesaurus.targetId = this.targetId.value;
    } else {
      thesaurus.entries = this._nodesService.getNodes().map((n) => {
        return {
          id: n.id,
          value: n.value,
        };
      });
    }

    return thesaurus;
  }

  public close(): void {
    this.editorClose.emit();
  }

  public save(): void {
    if (this.form.invalid) {
      return;
    }
    this.thesaurusChange.emit(this.getThesaurus());
  }
}
