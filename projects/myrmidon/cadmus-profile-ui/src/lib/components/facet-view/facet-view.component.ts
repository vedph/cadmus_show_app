import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatChipEvent } from '@angular/material/chips';
import { deepCopy, PartDefinition } from '@myrmidon/cadmus-core';
import { ColorService, DialogService } from '@myrmidon/cadmus-show-ui';
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
 */
@Component({
  selector: 'cadmus-facet-view',
  templateUrl: './facet-view.component.html',
  styleUrls: ['./facet-view.component.css'],
})
export class FacetViewComponent implements OnInit {
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
    this.refresh();
  }

  /**
   * Emitted when facet metadata edit is requested.
   */
  @Output()
  public editFacetMetadata: EventEmitter<GroupingFacet>;

  @Output()
  public editPart: EventEmitter<GroupedPartDefinition>;

  @Output()
  public viewPartInfo: EventEmitter<GroupedPartDefinition>;

  /**
   * Emitted when facet is saved.
   */
  @Output()
  public facetChange: EventEmitter<GroupingFacet>;

  public groupKeys: FormArray;
  public form: FormGroup;

  public color: FormControl;
  public colorForm: FormGroup;

  public selectedPartId: string | undefined;
  public copiedPart: PartDefinition | undefined;

  public dirty: boolean;

  constructor(
    private _formBuilder: FormBuilder,
    private _dialogService: DialogService,
    private _colorService: ColorService,
    private _partService: PartDefinitionVmService
  ) {
    this.editable = true;
    this.editFacetMetadata = new EventEmitter<GroupingFacet>();
    this.facetChange = new EventEmitter<GroupingFacet>();
    this.viewPartInfo = new EventEmitter<GroupedPartDefinition>();
    this.editPart = new EventEmitter<GroupedPartDefinition>();
    this.dirty = false;
    this._subs = [];
    // form
    this.groupKeys = _formBuilder.array([]);
    this.form = _formBuilder.group({
      groupKeys: this.groupKeys,
    });
    // color form
    this.color = _formBuilder.control(null, Validators.required);
    this.colorForm = _formBuilder.group({
      color: this.color,
    });
  }

  ngOnInit(): void {}

  private getGroupControl(group?: PartDefinitionGroup): FormGroup {
    return this._formBuilder.group({
      id: this._formBuilder.control(group?.id, [
        Validators.required,
        Validators.maxLength(50),
      ]),
    });
  }

  private refresh(): void {
    // reset group keys
    this.groupKeys.clear();
    for (let i = 0; i < this._subs.length; i++) {
      this._subs[i].unsubscribe();
    }

    // add group keys
    if (this._facet) {
      for (let g of this._facet.groups) {
        const ctl = this.getGroupControl(g);
        this._subs.push(
          ctl.valueChanges.subscribe((_) => {
            this.dirty = true;
          })
        );
        this.groupKeys.controls.push(ctl);
      }
    }

    // we're no more dirty
    this.form.markAsPristine();
    this.dirty = false;
  }

  public addGroup(item?: PartDefinitionGroup): void {
    if (!this._facet) {
      return;
    }
    this.groupKeys.push(this.getGroupControl(item));
    this.groupKeys.markAsDirty();
    this.dirty = true;
  }

  public removeGroup(index: number): void {
    this._dialogService
      .confirm(
        'Confirmation',
        `Delete group ${this.groupKeys.at(index).value}?`
      )
      .pipe(take(1))
      .subscribe((yes) => {
        if (yes) {
          this.groupKeys.removeAt(index);
          this._subs[index].unsubscribe();
          this._subs.splice(index, 1);
          this.groupKeys.markAsDirty();
          this.dirty = true;
        }
      });
  }

  public moveGroupUp(index: number): void {
    if (index < 1 || !this._facet) {
      return;
    }
    const ctl = this.groupKeys.controls[index];
    this.groupKeys.removeAt(index);
    this.groupKeys.insert(index - 1, ctl);
    this.groupKeys.markAsDirty();
    this.dirty = true;
  }

  public moveGroupDown(index: number): void {
    if (index + 1 >= this.groupKeys.length || !this._facet) {
      return;
    }
    const ctl = this.groupKeys.controls[index];
    this.groupKeys.removeAt(index);
    this.groupKeys.insert(index + 1, ctl);
    this.groupKeys.markAsDirty();
    this.dirty = true;
  }

  public getContrastColor(color: string | undefined): string {
    return this._colorService.getContrastColor(color || '');
  }

  public buildScopedPartId(groupIndex: number, part: PartDefinition): string {
    return this._partService.buildScopedPartId(groupIndex, part);
  }

  private findPart(
    id: string
  ): { groupIndex: number; partIndex: number } | null {
    if (!this._facet) {
      return null;
    }
    const parsedId = this._partService.parseScopedPartId(id);

    const i = this._facet.groups[parsedId.groupIndex].partDefinitions.findIndex(
      (d) => {
        return (
          d.typeId === parsedId.typeId &&
          ((!d.roleId && !parsedId.roleId) || d.roleId === parsedId.roleId)
        );
      }
    );
    return i > -1
      ? {
          groupIndex: parsedId.groupIndex,
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

  public editSelectedPart(): void {
    if (!this.selectedPartId) {
      return;
    }
    const gi = this.findPart(this.selectedPartId);
    if (!gi) {
      return;
    }
    this.editPart.emit(
      this._facet?.groups[gi.groupIndex].partDefinitions[gi.partIndex]
    );
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

  public editFacet(): void {
    if (this.facet) {
      this.editFacetMetadata.emit(this.facet);
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

  private updateFacet() {
    if (!this._facet) {
      return;
    }
    // update group IDs from controls
    for (let i = 0; i < this.groupKeys.length; i++) {
      this._facet.groups[i].id = (this.groupKeys.at(
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
