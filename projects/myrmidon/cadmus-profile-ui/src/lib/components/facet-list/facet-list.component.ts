import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { FacetDefinition, PartDefinition } from '@myrmidon/cadmus-core';
import { CadmusShopAssetService } from '@myrmidon/cadmus-shop-asset';
import { CadmusModel } from '@myrmidon/cadmus-shop-core';
import { FacetListService } from './store/facet-list.service';
import { GroupedPartDefinition, GroupingFacet } from './store/facet-list.store';

@Component({
  selector: 'cadmus-facet-list',
  templateUrl: './facet-list.component.html',
  styleUrls: ['./facet-list.component.css'],
})
export class FacetListComponent implements OnInit {
  private _editedPartFacetId: string | undefined;

  /**
   * The facets.
   */
  @Input()
  public facets: GroupingFacet[];
  @Output()
  public facetsChange: EventEmitter<GroupingFacet[]>;

  @ViewChild('info', { read: ElementRef, static: false }) public infoElemRef:
    | ElementRef<HTMLElement>
    | undefined;

  public editedFacet: FacetDefinition | undefined;
  public tabIndex: number;
  public currentModel: CadmusModel | undefined;
  public editedPart: GroupedPartDefinition | undefined;
  // new facet form
  public newFacetId: FormControl;
  public newFacetForm: FormGroup;

  constructor(
    formBuilder: FormBuilder,
    private _facetListService: FacetListService,
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
    this._editedPartFacetId = part.facetId;
    this.editedPart = part;
    this.tabIndex = 2;
  }

  public onPartChange(part: PartDefinition): void {
    // part has changed, we must refresh the whole facet
    const facetIndex = this.facets.findIndex(
      (f) => f.id === this._editedPartFacetId
    );
    if (facetIndex === -1) {
      return;
    }
    // get part definitions from it
    const parts = this._facetListService.getPartDefsFromGroupingFacet(
      this.facets[facetIndex]
    );
    // replace the edited part definition
    const i = parts.findIndex(
      (p) =>
        p.typeId === part.typeId &&
        ((!p.roleId && !part.roleId) || p.roleId === part.roleId)
    );
    if (i === -1) {
      return;
    }
    parts.splice(i, 1, part);

    // get the facet including the part which was edited
    // and replace its groups with updated groups
    const gf = this.facets[facetIndex];
    const facet: FacetDefinition = {
      id: gf.id,
      label: gf.label,
      colorKey: gf.colorKey || '',
      description: gf.description,
      partDefinitions: parts,
    };

    // replace the old facet with the updated one
    const newFacet: GroupingFacet = {
      ...gf,
      groups: this._facetListService.getFacetPartGroups(facet),
    };
    this.facets.splice(
      facetIndex,
      1,
      Object.assign(this.facets[facetIndex], newFacet)
    );

    this.onPartEditorClose();
  }

  public onPartEditorClose(): void {
    this._editedPartFacetId = undefined;
    this.tabIndex = 0;
    this.editedPart = undefined;
  }

  public onViewPartInfo(part: GroupedPartDefinition): void {
    const fragment = part.roleId?.startsWith('fr.');
    const typeId = fragment ? part.roleId : part.typeId;
    this._shopService.getModel(typeId, fragment).subscribe((m) => {
      if (m) {
        this._shopService.getModelDetails(m).subscribe((dm) => {
          this.currentModel = dm;
          this.infoElemRef?.nativeElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        });
      }
    });
  }

  public save(): void {
    this.facetsChange.emit(this.facets);
  }
}
