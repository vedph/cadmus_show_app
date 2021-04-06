import { Color } from '@angular-material-components/color-picker';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { PartDefinition } from '@myrmidon/cadmus-core';
import { CadmusShopAssetService } from '@myrmidon/cadmus-shop-asset';
import { CadmusModel } from '@myrmidon/cadmus-shop-core';
import { ColorService } from '@myrmidon/cadmus-show-ui';

@Component({
  selector: 'cadmus-part-definition-editor',
  templateUrl: './part-definition-editor.component.html',
  styleUrls: ['./part-definition-editor.component.css'],
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

  public typeId: FormControl;
  public roleId: FormControl;
  public name: FormControl;
  public description: FormControl;
  public required: FormControl;
  public colorKey: FormControl;
  public groupKey: FormControl;
  public sortKey: FormControl;
  public form: FormGroup;

  constructor(
    formBuilder: FormBuilder,
    private _colorService: ColorService,
    private _shopService: CadmusShopAssetService
  ) {
    this.definitionChange = new EventEmitter<PartDefinition>();
    this.editorClose = new EventEmitter<any>();
    // form
    this.typeId = formBuilder.control(null, [
      Validators.required,
      Validators.maxLength(100),
      Validators.pattern(/^[a-zA-Z][-_a-zA-Z0-9]+$/),
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
    this.required = formBuilder.control(false);
    this.colorKey = formBuilder.control(
      new Color(200, 200, 200),
      Validators.required
    );
    this.groupKey = formBuilder.control(null, [
      Validators.maxLength(50),
      Validators.pattern(/^[a-zA-Z][-_a-zA-Z0-9]+$/),
    ]);
    this.sortKey = formBuilder.control(null, [
      Validators.required,
      Validators.maxLength(50),
      Validators.pattern(/^[a-zA-Z][-_a-zA-Z0-9]+$/),
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
    this.roleId.setValue(definition.roleId);
    this.name.setValue(definition.name);
    this.description.setValue(definition.description);
    this.required.setValue(definition.isRequired);
    const rgb = this._colorService.parseRgb(definition.colorKey);
    this.colorKey.setValue(rgb ? new Color(rgb.r, rgb.g, rgb.b) : null);
    this.groupKey.setValue(definition.groupKey);
    this.sortKey.setValue(definition.sortKey);
    this.form.markAsPristine();
  }

  private getDefinition(): PartDefinition {
    return {
      typeId: this.typeId.value?.trim(),
      roleId: this.roleId.value?.trim(),
      name: this.name.value?.trim(),
      description: this.description.value?.trim(),
      isRequired: this.required.value ? true : false,
      colorKey: this.colorKey.value.hex,
      groupKey: this.groupKey.value?.trim(),
      sortKey: this.sortKey.value?.trim(),
    };
  }

  public onPartModelPicked(model: CadmusModel): void {
    this.typeId.setValue(model.id);
  }

  public onFragmentModelPicked(model: CadmusModel): void {
    this.roleId.setValue(model.id);
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
