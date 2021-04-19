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

    // add the new facet
    const newFacet: GroupingFacet = {
      id: this.newFacetId.value,
      label: 'new-facet',
      description: '',
      groups: [],
    };
    this.facets.push(newFacet);
  }

  public onFacetChange(facet: GroupingFacet): void {
    // add/replace the facet
    const i = this.facets.findIndex((f) => f.id === facet.id);
    if (i === -1) {
      this.facets.push(facet);
    } else {
      this.facets.splice(i, 1, facet);
    }
  }

  public onEditPart(part: GroupedPartDefinition): void {
    this._editedPartFacetId = part.facetId;
    this.editedPart = part;
    this.tabIndex = 2;
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
