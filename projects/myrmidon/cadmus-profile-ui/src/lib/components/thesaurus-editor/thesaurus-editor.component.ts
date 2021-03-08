import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ThesaurusEntry } from 'projects/myrmidon/cadmus-profile-core/src/public-api';
import { Observable } from 'rxjs';
import {
  ThesaurusNode,
  ThesaurusNodeFilter,
  ThesaurusNodesService,
} from '../../services/thesaurus-nodes.service';

@Component({
  selector: 'cadmus-thesaurus-editor',
  templateUrl: './thesaurus-editor.component.html',
  styleUrls: ['./thesaurus-editor.component.css'],
})
export class ThesaurusEditorComponent implements OnInit {
  public filter: FormControl;
  public parentId: FormControl;
  public form: FormGroup;

  public nodes: ThesaurusNode[];
  public parentIds$: Observable<ThesaurusEntry[]>;

  constructor(
    formBuilder: FormBuilder,
    private _nodesService: ThesaurusNodesService
  ) {
    this.nodes = [];
    this.parentIds$ = this._nodesService.selectParentIds();
    // form
    this.filter = formBuilder.control(null);
    this.parentId = formBuilder.control(null);
    this.form = formBuilder.group({
      filter: this.filter,
      parentId: this.parentId,
    });
  }

  ngOnInit(): void {}

  private getFilter(): ThesaurusNodeFilter {
    return {
      // TODO paging
      pageNumber: 1,
      pageSize: 20,
      idOrValue: this.filter.value,
      parentId: this.parentId.value,
    };
  }

  public applyFilter(): void {
    // TODO
  }
}
