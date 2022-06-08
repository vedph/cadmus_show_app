import { Color } from '@angular-material-components/color-picker';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormArray,
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { FlagDefinition } from '@myrmidon/cadmus-core';
import { ColorService } from '@myrmidon/cadmus-show-ui';

/**
 * Flag definition editor.
 */
@Component({
  selector: 'cadmus-flag-definition-editor',
  templateUrl: './flag-definition-editor.component.html',
  styleUrls: ['./flag-definition-editor.component.scss'],
})
export class FlagDefinitionEditorComponent implements OnInit {
  private _definition: FlagDefinition | undefined;

  @Input()
  public get flag(): FlagDefinition | undefined {
    return this._definition;
  }
  public set flag(value: FlagDefinition | undefined) {
    this._definition = value;
    this.updateForm(value);
  }

  @Output()
  public flagChange: EventEmitter<FlagDefinition>;
  @Output()
  public editorClose: EventEmitter<any>;

  public id: UntypedFormControl;
  public label: UntypedFormControl;
  public colorKey: UntypedFormControl;
  public description: UntypedFormControl;
  public form: UntypedFormGroup;
  public flagNumbers: number[];

  constructor(formBuilder: UntypedFormBuilder, private _colorService: ColorService) {
    this.flagChange = new EventEmitter<FlagDefinition>();
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
    this.updateForm(this.flag);
  }

  private getBit(value: number): number {
    let test = 1;
    for (let i = 0; i < 32; i++) {
      if ((value & test) !== 0) {
        return i;
      }
      test <<= 1;
    }
    return -1;
  }

  private updateForm(definition: FlagDefinition | undefined): void {
    if (!definition) {
      this.form.reset();
      return;
    }

    this.id.setValue(this.getBit(definition.id) + 1);
    this.label.setValue(definition.label);
    const rgb = this._colorService.parseRgb(definition.colorKey);
    this.colorKey.setValue(rgb ? new Color(rgb.r, rgb.g, rgb.b) : null);
    this.description.setValue(definition.description);

    this.form.markAsPristine();
  }

  private getFlag(): FlagDefinition {
    return {
      id: 1 << (this.id.value - 1),
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
    this.flagChange.emit(this.getFlag());
  }
}
