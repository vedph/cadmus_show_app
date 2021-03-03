import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { JsonEditorOptions } from 'ang-jsoneditor';
import { FlagListQuery } from '../flag-list/store/flag-list.query';
import { FlagListService } from '../flag-list/store/flag-list.service';

// https://github.com/mariohmol/ang-jsoneditor

@Component({
  selector: 'cadmus-flag-list-code',
  templateUrl: './flag-list-code.component.html',
  styleUrls: ['./flag-list-code.component.css']
})
export class FlagListCodeComponent implements OnInit {
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
    private _flQuery: FlagListQuery,
    private _flService: FlagListService,
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
    this.json.setValue(this._flQuery.getAll());
  }

  public save(): void {
    this._flService.set(this.json.value);
    this._snackbar.open('Flags saved', 'OK', {
      duration: 1500,
    });
  }
}
