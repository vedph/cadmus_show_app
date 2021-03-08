import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { JsonEditorOptions } from 'ang-jsoneditor';
import { RamThesaurusService } from '../../services/ram-thesaurus.service';
import { ThesaurusListQuery } from '../thesaurus-list/store/thesaurus-list.query';

// https://github.com/mariohmol/ang-jsoneditor

@Component({
  selector: 'cadmus-thesaurus-list-code',
  templateUrl: './thesaurus-list-code.component.html',
  styleUrls: ['./thesaurus-list-code.component.css'],
})
export class ThesaurusListCodeComponent implements OnInit {
  @Input()
  public get code(): string {
    return this.json.value;
  }
  public set code(value: string) {
    this.json.setValue(value);
  }

  public editorOptions: JsonEditorOptions;

  public json: FormControl;
  public form: FormGroup;

  constructor(
    formBuilder: FormBuilder,
    private _tlQuery: ThesaurusListQuery,
    private _thesService: RamThesaurusService,
    private _snackbar: MatSnackBar
  ) {
    // options
    this.editorOptions = new JsonEditorOptions();
    this.editorOptions.modes = ['code', 'text', 'tree', 'view'];
    // form
    this.json = formBuilder.control([]);
    this.form = formBuilder.group({
      json: this.json,
    });
  }

  ngOnInit(): void {
    this.json.setValue(this._tlQuery.getAll());
  }

  public save(): void {
    this._thesService.setAll(this.json.value);
    this._snackbar.open('Thesauri saved', 'OK', {
      duration: 1500,
    });
  }
}
