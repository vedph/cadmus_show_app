import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatChipEvent } from '@angular/material/chips';
import {
  FacetDefinition,
  PartDefinition,
} from '@myrmidon/cadmus-core';
import { ColorService, DialogService } from '@myrmidon/cadmus-show-ui';
import { deepCopy } from '@myrmidon/ng-tools';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { PartDefinitionVmService } from '../../services/part-definition-vm.service';
import {
  GroupedPartDefinition,
  GroupingFacet,
  PartDefinitionGroup,
} from '../facet-list/store/facet-list.store';

/**
 * A facet's view, with its groups and parts.
 * This component receives a GroupingFacet, and when editable allows users
 * editing it.
 */
@Component({
  selector: 'cadmus-facet-view',
  templateUrl: './facet-view.component.html',
  styleUrls: ['./facet-view.component.css'],
})
export class FacetViewComponent {
  private _facet: GroupingFacet | undefined;
  private _subs: Subscription[];

  /**
   * True if this is an editable view.
   */
  @Input()
  public editable: boolean;

  /**
   * The facet.
   */
  @Input()
  public get facet(): GroupingFacet | undefined {
    return this._facet;
  }
  public set facet(value: GroupingFacet | undefined) {
    this._facet = value;
    this.updateForm();
  }

  /**
   * Emitted when the facet is saved.
   */
  @Output()
  public facetChange: EventEmitter<GroupingFacet>;

  /**
   * Emitted when viewing a part's information is requested.
   */
  @Output()
  public viewPartInfo: EventEmitter<GroupedPartDefinition>;

  public tabIndex: number;
  public dirty: boolean;

  // form
  public groups: FormArray;
  public form: FormGroup;

  // color form
  public color: FormControl;
  public colorForm: FormGroup;

  // part editing
  public selectedPartId: string | undefined;
  public copiedPart: PartDefinition | undefined;
  public editedPart: GroupedPartDefinition | undefined;

  // facet metadata editing
  public editedFacet: FacetDefinition | undefined;

  constructor(
    private _formBuilder: FormBuilder,
    private _dialogService: DialogService,
    private _colorService: ColorService,
    private _partService: PartDefinitionVmService
  ) {
    this.tabIndex = 0;
    this.editable = true;
    this.dirty = false;
    this._subs = [];
    this.facetChange = new EventEmitter<GroupingFacet>();
    this.viewPartInfo = new EventEmitter<GroupedPartDefinition>();
    // form
    this.groups = _formBuilder.array([]);
    this.form = _formBuilder.group({
      groups: this.groups,
    });
    // color form
    this.color = _formBuilder.control(null, Validators.required);
    this.colorForm = _formBuilder.group({
      color: this.color,
    });
  }

  private updateForm(): void {
    // reset group keys
    this.groups.clear();

    // unsubscribe from all the groups
    for (let i = 0; i < this._subs.length; i++) {
      this._subs[i].unsubscribe();
    }

    // add groups from the facet
    if (this._facet) {
      for (let group of this._facet.groups) {
        this.addGroupControl(group);
      }
    }

    // we're no more dirty
    this.form.markAsPristine();
    this.dirty = false;
  }

  public getContrastColor(color: string | undefined): string {
    return this._colorService.getContrastColor(color || '');
  }

  //#region Groups
  private getGroupControl(group?: PartDefinitionGroup): FormGroup {
    return this._formBuilder.group({
      id: this._formBuilder.control(group?.id, [
        Validators.required,
        Validators.maxLength(50),
      ]),
    });
  }

  private addGroupControl(group?: PartDefinitionGroup): void {
    const g = this.getGroupControl(group);
    this._subs.push(
      g.valueChanges.subscribe((_) => {
        this.dirty = true;
      })
    );
    this.groups.controls.push(g);
    this.groups.markAsDirty();
    this.dirty = true;
  }

  public addGroup(group?: PartDefinitionGroup): void {
    if (!this._facet) {
      return;
    }
    this.addGroupControl(group);
  }

  public addNewGroup(): void {
    if (!this.facet?.groups) {
      return;
    }
    const group = {
      id: 'new-group',
      partDefinitions: [],
    };
    this.facet.groups.push(group);
    this.addGroupControl(group);
  }

  public removeGroup(index: number): void {
    this._dialogService
      .confirm('Confirmation', `Delete group ${this.groups.at(index).value}?`)
      .pipe(take(1))
      .subscribe((yes) => {
        if (yes) {
          this.groups.removeAt(index);
          this._subs[index].unsubscribe();
          this._subs.splice(index, 1);
          this.groups.markAsDirty();
          this.dirty = true;
        }
      });
  }

  public moveGroupUp(index: number): void {
    if (index < 1 || !this._facet) {
      return;
    }
    const sub = this._subs[index];
    this._subs[index] = this._subs[index - 1];
    this._subs[index - 1] = sub;

    const ctl = this.groups.controls[index];
    this.groups.removeAt(index);
    this.groups.insert(index - 1, ctl);

    this.groups.markAsDirty();
    this.dirty = true;
  }

  public moveGroupDown(index: number): void {
    if (index + 1 >= this.groups.length || !this._facet) {
      return;
    }
    const sub = this._subs[index];
    this._subs[index] = this._subs[index + 1];
    this._subs[index + 1] = sub;

    const ctl = this.groups.controls[index];
    this.groups.removeAt(index);
    this.groups.insert(index + 1, ctl);

    this.groups.markAsDirty();
    this.dirty = true;
  }

  public colorizeGroup(index: number): void {
    if (!this._facet) {
      return;
    }
    this._dialogService
      .confirm('Confirmation', 'Reassign all the colors in group?')
      .pipe(take(1))
      .subscribe((yes) => {
        if (yes && this._facet) {
          const tot = this._facet.groups[index].partDefinitions.length || 0;
          for (let i = 0; i < tot; i++) {
            this._facet.groups[index].partDefinitions[
              i
            ].colorKey = this._colorService.nextPaletteColor(i, tot);
          }
          this.dirty = true;
        }
      });
  }
  //#endregion

  //#region Parts
  public buildScopedPartId(groupIndex: number, part: PartDefinition): string {
    return this._partService.buildScopedPartId({
      groupId: this._facet?.groups[groupIndex].id || '',
      typeId: part.typeId,
      roleId: part.roleId
    });
  }

  private findPart(
    id: string
  ): { groupIndex: number; partIndex: number } | null {
    if (!this._facet) {
      return null;
    }
    const parsedId = this._partService.parseScopedPartId(id);
    const groupIndex = this._facet.groups.findIndex(
      (g) => g.id === parsedId.groupId
    );

    const i = this._facet.groups[groupIndex].partDefinitions.findIndex(
      (d) => {
        return (
          d.typeId === parsedId.typeId &&
          ((!d.roleId && !parsedId.roleId) || d.roleId === parsedId.roleId)
        );
      }
    );
    return i > -1
      ? {
          groupIndex: groupIndex,
          partIndex: i,
        }
      : null;
  }

  public onPartClick(event: MouseEvent): void {
    this.selectedPartId = (event.currentTarget as HTMLElement).id;
    const gi = this.findPart(this.selectedPartId);
    if (!gi) {
      return;
    }
    this.viewPartInfo.emit(
      this._facet?.groups[gi.groupIndex].partDefinitions[gi.partIndex]
    );
  }

  public addNewPart(groupIndex: number): void {
    if (!this._facet?.groups) {
      return;
    }
    const newPart: PartDefinition = {
      typeId: '',
      roleId: '',
      isRequired: false,
      name: '',
      description: '',
      groupKey: this._facet.groups[groupIndex].id,
      sortKey: '',
      colorKey: 'E0E0E0',
    };
    const newGroupedPart: GroupedPartDefinition = {
      facetId: this._facet.id,
      scopedId: this.buildScopedPartId(groupIndex, newPart),
      ...newPart,
    };
    this._facet.groups[groupIndex].partDefinitions.push(newGroupedPart);
    this.selectedPartId = newGroupedPart.scopedId;
    this.editSelectedPart();
  }

  public onPartRemoved(event: MatChipEvent): void {
    if (!this._facet) {
      return;
    }
    const id = event.chip.value;
    const label = id.substr(id.indexOf(':') + 1);
    this._dialogService
      .confirm('Confirmation', `Delete part ${label}?`)
      .pipe(take(1))
      .subscribe((yes) => {
        if (yes) {
          const gi = this.findPart(id);
          if (!gi) {
            return;
          }
          this._facet?.groups[gi.groupIndex].partDefinitions.splice(
            gi.partIndex,
            1
          );
          this.dirty = true;
          // deselect part if it was deleted
          if (this.selectedPartId === id) {
            this.selectedPartId = undefined;
          }
        }
      });
  }

  public onPartDrop(event: CdkDragDrop<GroupedPartDefinition[]>) {
    if (!this.editable || !this._facet) {
      return;
    }
    if (event.previousContainer === event.container) {
      console.log(`in-drop: ${event.previousIndex}->${event.currentIndex}`);
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      console.log(`out-drop: ${event.previousIndex}->${event.currentIndex}`);
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
    this.dirty = true;
  }

  public colorizeSelectedPart(): void {
    if (!this.selectedPartId || this.colorForm.invalid || !this._facet) {
      return;
    }
    const gi = this.findPart(this.selectedPartId);
    if (gi) {
      this._facet.groups[gi.groupIndex].partDefinitions[
        gi.partIndex
      ].colorKey = this.color.value.hex;
      this.dirty = true;
    }
  }

  public copySelectedPart(): void {
    if (!this.selectedPartId || !this._facet) {
      return;
    }
    const gi = this.findPart(this.selectedPartId);
    if (gi) {
      this.copiedPart = this._facet.groups[gi.groupIndex].partDefinitions[
        gi.partIndex
      ];
    }
  }

  public addCopiedPart(index: number): void {
    if (!this.selectedPartId || !this._facet) {
      return;
    }
    const gi = this.findPart(this.selectedPartId);
    if (gi && gi.groupIndex !== index) {
      const part = deepCopy(
        this._facet.groups[gi.groupIndex].partDefinitions[gi.partIndex]
      );
      this._facet.groups[index].partDefinitions.push(part);
      this.dirty = true;
    }
  }
  //#endregion

  //#region Facet editor
  public editFacet(): void {
    if (!this._facet) {
      return;
    }
    this.editedFacet = {
      id: this._facet.id,
      label: this._facet.label,
      description: this._facet.description,
      colorKey: this._facet.colorKey || '',
      partDefinitions: [],
    };
    setTimeout(() => {
      this.tabIndex = 1;
    }, 300);
  }

  public onFacetChange(facet: FacetDefinition): void {
    this.facet = Object.assign(this._facet, facet);
    this.dirty = true;
    this.onFacetEditorClose();
  }

  public onFacetEditorClose(): void {
    this.tabIndex = 0;
    this.editedFacet = undefined;
  }
  //#endregion

  //#region Part editor
  public editSelectedPart(): void {
    if (!this.selectedPartId) {
      return;
    }
    const gi = this.findPart(this.selectedPartId);
    if (!gi) {
      return;
    }

    this.editedPart = this._facet?.groups[gi.groupIndex].partDefinitions[
      gi.partIndex
    ];

    setTimeout(() => {
      this.tabIndex = 2;
    }, 300);
  }

  public onPartChange(part: PartDefinition): void {
    // part has changed, we must refresh the whole facet
    // get part definitions from it
    const parts = this._partService.getPartDefsFromGroup(
      this._facet as GroupingFacet
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
    const gf = this._facet as GroupingFacet;
    const facet: FacetDefinition = {
      id: gf.id,
      label: gf.label,
      colorKey: gf.colorKey || '',
      description: gf.description,
      partDefinitions: parts,
    };
    this.onPartEditorClose();

    // emit facet change
    const newFacet: GroupingFacet = {
      ...gf,
      groups: this._partService.getFacetPartGroups(facet),
    };
    this.facetChange.emit(newFacet);
  }

  public onPartEditorClose(): void {
    this.tabIndex = 0;
    this.editedPart = undefined;
  }
  //#endregion

  private updateFacet() {
    if (!this._facet) {
      return;
    }
    // update group IDs from controls
    for (let i = 0; i < this.groups.length; i++) {
      this._facet.groups[i].id = (this.groups.at(
        i
      ) as FormGroup).controls.id.value?.trim();
    }
  }

  public save(): void {
    this.updateFacet();
    if (this._facet) {
      this.facetChange.emit(this._facet);
      this.dirty = false;
    }
  }
}
