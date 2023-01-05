import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { JsonEditorOptions } from 'ang-jsoneditor';

/**
 * JSON code editor.
 */
@Component({
  selector: 'cadmus-json-editor',
  templateUrl: './json-editor.component.html',
  styleUrls: ['./json-editor.component.scss'],
})
export class JsonEditorComponent implements OnInit {
  @ViewChild('editor', { static: false }) public editorRef: any;

  /**
   * The data being edited.
   */
  @Input()
  public get data(): any {
    return this.json.value;
  }
  public set data(value: any) {
    this.json.setValue(value);
  }

  /**
   * Emitted when data is saved.
   */
  @Output()
  public dataChange: EventEmitter<any>;

  @Input()
  public editorOptions: JsonEditorOptions;

  public json: FormControl<any>;
  public form: FormGroup;

  constructor(formBuilder: FormBuilder) {
    this.dataChange = new EventEmitter<string>();
    // options
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
    if (this.json.value !== this.data) {
      this.json.setValue(this.data);
    }
  }

  public save(): void {
    this.dataChange.emit(this.json.value);
  }
}
