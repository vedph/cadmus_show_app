import { Color } from '@angular-material-components/color-picker';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { FlagDefinition } from 'projects/myrmidon/cadmus-profile-core/src/public-api';
import { ColorService } from 'projects/myrmidon/cadmus-show-ui/src/public-api';

/**
 * Flag definition editor.
 */
@Component({
  selector: 'cadmus-flag-definition-editor',
  templateUrl: './flag-definition-editor.component.html',
  styleUrls: ['./flag-definition-editor.component.css'],
})
export class FlagDefinitionEditorComponent implements OnInit {
  private _definition: FlagDefinition | undefined;

  @Input()
  public get definition(): FlagDefinition | undefined {
    return this._definition;
  }
  public set definition(value: FlagDefinition | undefined) {
    this._definition = value;
    this.updateForm(value);
  }

  @Output()
  public definitionChange: EventEmitter<FlagDefinition>;
  @Output()
  public editorClose: EventEmitter<any>;

  public id: FormControl;
  public label: FormControl;
  public colorKey: FormControl;
  public description: FormControl;
  public form: FormGroup;
  public flagNumbers: number[];

  constructor(formBuilder: FormBuilder, private _colorService: ColorService) {
    this.definitionChange = new EventEmitter<FlagDefinition>();
    this.editorClose = new EventEmitter<any>();
    // https://2ality.com/2014/05/es6-array-methods.html
    this.flagNumbers = Array.from({ length: 32 }, (_, i) => i + 1);
    // form
    this.id = formBuilder.control(1, [
      Validators.required,
      Validators.min(1),
      Validators.max(32),
    ]);
    this.label = formBuilder.control(null, [
      Validators.required,
      Validators.maxLength(50),
    ]);
    this.colorKey = formBuilder.control(null, Validators.required);
    this.description = formBuilder.control(null, [
      Validators.required,
      Validators.maxLength(100),
    ]);
    this.form = formBuilder.group({
      id: this.id,
      label: this.label,
      colorKey: this.colorKey,
      description: this.description,
    });
  }

  ngOnInit(): void {
    this.updateForm(this.definition);
  }

  private updateForm(definition: FlagDefinition | undefined): void {
    if (!definition) {
      this.form.reset();
      return;
    }

    this.id.setValue(definition.id);
    this.label.setValue(definition.label);
    const rgb = this._colorService.parseRgb(definition.colorKey);
    this.colorKey.setValue(rgb ? new Color(rgb.r, rgb.g, rgb.b) : null);
    this.description.setValue(definition.description);

    this.form.markAsPristine();
  }

  private getDefinition(): FlagDefinition {
    return {
      id: 1 << this.id.value,
      label: this.label.value?.trim(),
      colorKey: this.colorKey.value.hex,
      description: this.description.value?.trim(),
    };
  }

  public cancel(): void {
    this.editorClose.emit();
  }

  public save(): void {
    if (this.form.invalid) {
      return;
    }
    this.definitionChange.emit(this.getDefinition());
  }
}
