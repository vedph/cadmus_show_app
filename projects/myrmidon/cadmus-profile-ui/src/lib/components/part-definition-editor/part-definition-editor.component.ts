import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { PartDefinition } from '@myrmidon/cadmus-core';
import { CadmusModel } from '@myrmidon/cadmus-shop-core';
import { ColorService } from '@myrmidon/cadmus-ui';

@Component({
  selector: 'cadmus-part-definition-editor',
  templateUrl: './part-definition-editor.component.html',
  styleUrls: ['./part-definition-editor.component.scss'],
})
export class PartDefinitionEditorComponent implements OnInit {
  private _definition: PartDefinition | undefined;

  /**
   * The part definition being edited.
   */
  @Input()
  public get definition(): PartDefinition | undefined {
    return this._definition;
  }
  public set definition(value: PartDefinition | undefined) {
    this._definition = value;
    this.updateForm(value);
  }

  /**
   * Emitted when the definition has been saved.
   */
  @Output()
  public definitionChange: EventEmitter<PartDefinition>;
  /**
   * Emitted when editing is cancelled.
   */
  @Output()
  public editorClose: EventEmitter<any>;

  public typeId: FormControl<string | null>;
  public roleId: FormControl<string | null>;
  public name: FormControl<string | null>;
  public description: FormControl<string | null>;
  public required: FormControl<boolean>;
  public colorKey: FormControl<string | null>;
  public groupKey: FormControl<string | null>;
  public sortKey: FormControl<string | null>;
  public form: FormGroup;

  constructor(formBuilder: FormBuilder, private _colorService: ColorService) {
    this.definitionChange = new EventEmitter<PartDefinition>();
    this.editorClose = new EventEmitter<any>();
    // form
    this.typeId = formBuilder.control(null, [
      Validators.required,
      Validators.maxLength(100),
      Validators.pattern(/^[a-zA-Z][-._a-zA-Z0-9]+$/),
    ]);
    this.roleId = formBuilder.control(null, [
      Validators.maxLength(50),
      Validators.pattern(/^[a-zA-Z][-_a-zA-Z0-9]+$/),
    ]);
    this.name = formBuilder.control(null, [
      Validators.required,
      Validators.maxLength(50),
    ]);
    this.description = formBuilder.control(null, [
      Validators.required,
      Validators.maxLength(500),
    ]);
    this.required = formBuilder.control(false, { nonNullable: true });
    this.colorKey = formBuilder.control('#e0e0e0', Validators.required);
    this.groupKey = formBuilder.control(null, [
      Validators.maxLength(50),
      Validators.pattern(/^[a-zA-Z][-._a-zA-Z0-9]+$/),
    ]);
    this.sortKey = formBuilder.control(null, [
      Validators.required,
      Validators.maxLength(50),
      Validators.pattern(/^[a-zA-Z][-._a-zA-Z0-9]*$/),
    ]);
    this.form = formBuilder.group({
      typeId: this.typeId,
      roleId: this.roleId,
      name: this.name,
      description: this.description,
      required: this.required,
      colorKey: this.colorKey,
      groupKey: this.groupKey,
      sortKey: this.sortKey,
    });
  }

  ngOnInit(): void {
    this.updateForm(this.definition);
  }

  private updateForm(definition: PartDefinition | undefined): void {
    if (!definition) {
      this.form.reset();
      return;
    }

    this.typeId.setValue(definition.typeId);
    this.roleId.setValue(definition.roleId || null);
    this.name.setValue(definition.name);
    this.description.setValue(definition.description);
    this.required.setValue(definition.isRequired);
    this.colorKey.setValue(definition.colorKey);
    this.groupKey.setValue(definition.groupKey);
    this.sortKey.setValue(definition.sortKey);
    this.form.markAsPristine();
  }

  private getDefinition(): PartDefinition {
    return {
      typeId: this.typeId.value?.trim() || '',
      roleId: this.roleId.value?.trim(),
      name: this.name.value?.trim() || '',
      description: this.description.value?.trim() || '',
      isRequired: this.required.value ? true : false,
      colorKey: this.colorKey.value || '',
      groupKey: this.groupKey.value?.trim() || '',
      sortKey: this.sortKey.value?.trim() || '',
    };
  }

  public onPartModelPicked(model: CadmusModel): void {
    if (model) {
      this.typeId.setValue(model.id);
      this.typeId.updateValueAndValidity();
    }
  }

  public onFragmentModelPicked(model: CadmusModel): void {
    if (model) {
      this.roleId.setValue(model.id);
      this.roleId.updateValueAndValidity();
    }
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
