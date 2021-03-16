import { Color } from '@angular-material-components/color-picker';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { FacetDefinition } from '@myrmidon/cadmus-core';
import { ColorService } from 'projects/myrmidon/cadmus-show-ui/src/public-api';

/**
 * Editor for facet definition metadata, i.e. all the data of a facet
 * except for its part definitions.
 */
@Component({
  selector: 'cadmus-facet-metadata-editor',
  templateUrl: './facet-metadata-editor.component.html',
  styleUrls: ['./facet-metadata-editor.component.css'],
})
export class FacetMetadataEditorComponent implements OnInit {
  private _facet: FacetDefinition | undefined;

  /**
   * The facet definition to edit.
   */
  @Input()
  public get facet(): FacetDefinition | undefined {
    return this._facet;
  }
  public set facet(value: FacetDefinition | undefined) {
    this._facet = value;
    this.updateForm(value);
  }

  /**
   * Emitted when facet is saved.
   */
  @Output()
  public facetChange: EventEmitter<FacetDefinition>;
  /**
   * Emitted when editing is cancelled.
   */
  @Output()
  public editorClose: EventEmitter<any>;

  public id: FormControl;
  public label: FormControl;
  public colorKey: FormControl;
  public description: FormControl;
  public form: FormGroup;

  constructor(formBuilder: FormBuilder, private _colorService: ColorService) {
    this.facetChange = new EventEmitter<FacetDefinition>();
    this.editorClose = new EventEmitter<any>();
    // form
    this.id = formBuilder.control(null, [
      Validators.required,
      Validators.maxLength(50),
      Validators.pattern(/^[-a-zA-Z0-9_]+$/),
    ]);
    this.label = formBuilder.control(null, [
      Validators.required,
      Validators.maxLength(100),
    ]);
    this.colorKey = formBuilder.control(null);
    this.description = formBuilder.control(null, Validators.maxLength(500));
    this.form = formBuilder.group({
      id: this.id,
      label: this.label,
      colorKey: this.colorKey,
      description: this.description,
    });
  }

  ngOnInit(): void {
    this.updateForm(this.facet);
  }

  private updateForm(model: FacetDefinition | undefined): void {
    if (!model) {
      this.form.reset();
      return;
    }

    this.id.setValue(model.id);
    this.label.setValue(model.label);
    const rgb = this._colorService.parseRgb(model.colorKey);
    this.colorKey.setValue(rgb ? new Color(rgb.r, rgb.g, rgb.b) : null);
    this.description.setValue(model.description);

    this.form.markAsPristine();
  }

  private getFacet(): FacetDefinition {
    return {
      id: this.id.value,
      label: this.label.value?.trim(),
      colorKey: this.colorKey.value.hex,
      description: this.description.value?.trim(),
      partDefinitions: [],
    };
  }

  public cancel(): void {
    this.editorClose.emit();
  }

  public save(): void {
    if (this.form.invalid) {
      return;
    }
    const model = this.getFacet();
    this.facetChange.emit(model);
  }
}
