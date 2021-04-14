import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { FacetDefinition } from '@myrmidon/cadmus-core';
import { CadmusShopAssetService } from '@myrmidon/cadmus-shop-asset';
import { CadmusModel } from '@myrmidon/cadmus-shop-core';
import { GroupedPartDefinition, GroupingFacet } from './store/facet-list.store';

@Component({
  selector: 'cadmus-facet-list',
  templateUrl: './facet-list.component.html',
  styleUrls: ['./facet-list.component.css'],
})
export class FacetListComponent implements OnInit {
  /**
   * The facets.
   */
  @Input()
  public facets: GroupingFacet[];
  @Output()
  public facetsChange: EventEmitter<GroupingFacet[]>;

  public editedFacet: FacetDefinition | undefined;
  public tabIndex: number;
  public currentModel: CadmusModel | undefined;
  public editedPart: GroupedPartDefinition | undefined;
  // new facet form
  public newFacetId: FormControl;
  public newFacetForm: FormGroup;

  constructor(
    formBuilder: FormBuilder,
    private _shopService: CadmusShopAssetService
  ) {
    this.facets = [];
    this.tabIndex = 0;
    this.facetsChange = new EventEmitter<GroupingFacet[]>();
    // form
    this.newFacetId = formBuilder.control(null, [
      Validators.required,
      Validators.maxLength(50),
      Validators.pattern(/^[-a-zA-Z0-9_]+$/),
    ]);
    this.newFacetForm = formBuilder.group({
      id: this.newFacetId,
    });
  }

  ngOnInit(): void {}

  /**
   * Edit the specified facet's metadata.
   *
   * @param facet The grouping facet to edit.
   */
  public onEditFacet(facet: GroupingFacet): void {
    this.editedFacet = {
      id: facet.id,
      label: facet.label,
      description: facet.description,
      colorKey: facet.colorKey || '',
      partDefinitions: [],
    };
    setTimeout(() => {
      this.tabIndex = 1;
    }, 300);
  }

  /**
   * Add a new facet and edit it.
   */
  public addFacet(): void {
    // do not add if invalid or already existing ID
    if (
      this.newFacetForm.invalid ||
      this.facets.find((f) => f.id === this.newFacetId.value)
    ) {
      return;
    }

    // edit a newly created facet
    this.onEditFacet({
      id: this.newFacetId.value,
      label: '',
      description: '',
      groups: [],
    });
  }

  /**
   * Handle the facet metadata changes.
   *
   * @param facet The updated facet metadata.
   */
  public onFacetChange(facet: FacetDefinition): void {
    if (!this.editedFacet) {
      return;
    }
    // add/replace the facet
    const i = this.facets.findIndex((f) => f.id === facet.id);
    if (i === -1) {
      this.facets.push({ ...facet, groups: [] });
    } else {
      this.facets.splice(i, 1, Object.assign(this.facets[i], facet));
    }

    this.onFacetEditorClose();
  }

  /**
   * Close the facet metadata editor.
   */
  public onFacetEditorClose(): void {
    this.tabIndex = 0;
    this.editedFacet = undefined;
  }

  public onEditPart(part: GroupedPartDefinition): void {
    // TODO edit part definition
  }

  public onViewPartInfo(part: GroupedPartDefinition): void {
    const fragment = part.roleId?.startsWith('fr.');
    const typeId = fragment? part.roleId : part.typeId;
    this._shopService.getModel(typeId, fragment).subscribe((m) => {
      if (m) {
        this._shopService.getModelDetails(m).subscribe((dm) => {
          this.currentModel = dm;
        });
      }
    });
  }

  public save(): void {
    this.facetsChange.emit(this.facets);
  }
}
