import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { JsonEditorOptions } from 'ang-jsoneditor';
import { FlagListQuery } from '../flag-list/store/flag-list.query';
import { FlagListService } from '../flag-list/store/flag-list.service';

// https://github.com/mariohmol/ang-jsoneditor

@Component({
  selector: 'cadmus-flag-list-code',
  templateUrl: './flag-list-code.component.html',
  styleUrls: ['./flag-list-code.component.css'],
})
export class FlagListCodeComponent implements OnInit {
  @ViewChild('editor', { static: false }) public editorRef: any;

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
    // https://github.com/josdejong/jsoneditor/issues/211
    this.editorOptions = new JsonEditorOptions();
    this.editorOptions.modes = ['code', 'text', 'tree', 'view'];
    this.editorOptions.onModeChange = (newMode, oldMode) => {
      if (newMode === 'code') {
        const editor = this.editorRef.editor;
        editor.aceEditor.setOptions({
          maxLines: 1000,
        });
      }
    };
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
