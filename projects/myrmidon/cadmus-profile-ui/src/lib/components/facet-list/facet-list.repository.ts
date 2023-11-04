import { moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { deepCopy } from '@myrmidon/ng-tools';

import { FacetDefinition, PartDefinition } from '@myrmidon/cadmus-core';
import { ColorService } from '@myrmidon/cadmus-ui';

import { PartDefinitionVmService } from '../../services/part-definition-vm.service';

// - GroupingFacet (id, label, description, colorKey, groups)
// -- PartDefinitionGroup (id, partDefinitions)
// --- GroupedPartDefinition (scopedId, typeId, roleId, name, description,
// isRequired, colorKey, groupKey, sortKey)

export interface GroupedPartDefinitionId {
  groupId: string;
  typeId: string;
  roleId?: string | null;
}

/**
 * A part definition inside a group.
 */
export interface GroupedPartDefinition extends PartDefinition {
  facetId?: string;
  scopedId: string;
}

/**
 * A group of part definitions.
 */
export interface PartDefinitionGroup {
  id: string;
  partDefinitions: GroupedPartDefinition[];
}

/**
 * A facet grouping its parts definitions.
 */
export interface GroupingFacet {
  id: string;
  label: string;
  description: string;
  colorKey?: string;
  groups: PartDefinitionGroup[];
}

@Injectable({ providedIn: 'root' })
export class FacetListRepository {
  private _facets$: BehaviorSubject<GroupingFacet[]>;
  private _activeFacet$: BehaviorSubject<GroupingFacet | undefined>;

  public get facets$(): Observable<GroupingFacet[]> {
    return this._facets$;
  }

  public get activeFacet$(): Observable<GroupingFacet | undefined> {
    return this._activeFacet$;
  }

  constructor(
    private _vmService: PartDefinitionVmService,
    private _colorService: ColorService
  ) {
    this._activeFacet$ = new BehaviorSubject<GroupingFacet | undefined>(
      undefined
    );
    this._facets$ = new BehaviorSubject<GroupingFacet[]>([]);
  }

  public getFacets(): GroupingFacet[] {
    return this._facets$.value;
  }

  public getCount(): number {
    return this._facets$.value.length;
  }

  /**
   * Set the facets.
   *
   * @param facets The facets definitions.
   */
  public setFacets(facets: FacetDefinition[]): void {
    // map each facet into a GroupingFacet
    const groupingFacets = this._vmService.getFacetGroups(facets);
    this._facets$.next(groupingFacets);
  }

  /**
   * Add a new facet with the specified ID, and set it
   * as the active facet.
   *
   * @param id The ID to assign to the new facet.
   */
  public addNewFacet(id = 'new'): void {
    const facet: GroupingFacet = {
      id: id,
      label: id,
      description: '',
      groups: [],
    };
    // add facet and set as the active
    this._facets$.next([...this._facets$.value, facet]);
    this._activeFacet$.next(facet);
  }

  /**
   * Update the metadata of the specified facet.
   *
   * @param facet The new facet's metadata.
   */
  public updateFacetMetadata(facet: FacetDefinition): void {
    const old = this._facets$.value.find((f) => f.id === facet.id);
    if (old) {
      const updated = {
        ...old,
        label: facet.label,
        description: facet.description,
        colorKey: facet.colorKey,
      };
      this._facets$.next(
        this._facets$.value.map((f) => (f.id === facet.id ? updated : f))
      );
    }
  }

  /**
   * Move the facet from the specified index to the specified index.
   *
   * @param from The source index.
   * @param to The target index.
   */
  public moveFacet(from: number, to: number): void {
    this._facets$.next(
      this._facets$.value.map((f, i) => {
        return i === from
          ? this._facets$.value[to]
          : i === to
          ? this._facets$.value[from]
          : f;
      })
    );
  }

  /**
   * Delete the facet with the specified ID.
   *
   * @param id The facet's ID.
   */
  public deleteFacet(id: string): void {
    this._facets$.next(
      this._facets$.value.filter((f) => {
        return f.id !== id;
      })
    );
  }

  /**
   * Add a new group to the facet with the specified ID.
   *
   * @param facetId The ID of the facet the group belongs to.
   * @param id The new group ID.
   */
  public addGroup(facetId: string, id = 'new'): void {
    const facet = this._facets$.value.find((f) => f.id === facetId);
    if (!facet) {
      return;
    }
    const group: PartDefinitionGroup = {
      id: id,
      partDefinitions: [],
    };
    const updated = { ...facet, groups: [...facet.groups, group] };
    this._facets$.next(
      this._facets$.value.map((f) => (f.id === facetId ? updated : f))
    );
  }

  /**
   * Move the group in the facet with the specified ID from the specified
   * source index to the specified target index.
   *
   * @param facetId The ID of the facet the group belongs to.
   * @param from The source index.
   * @param to The target index.
   */
  public moveGroup(facetId: string, from: number, to: number): void {
    const facet = this._facets$.value.find((f) => f.id === facetId);
    if (!facet) {
      return;
    }
    const groups = [...facet.groups];
    moveItemInArray(groups, from, to);

    this._facets$.next(
      this._facets$.value.map((f) =>
        f.id === facetId ? { ...facet, groups } : f
      )
    );
  }

  /**
   * Remove the group with the specified ID from the facet with the
   * specified ID.
   *
   * @param facetId The ID of the facet the group belongs to.
   * @param id The group's ID.
   */
  public deleteGroup(facetId: string, id: string): void {
    const facet = this._facets$.value.find((f) => f.id === facetId);
    if (!facet) {
      return;
    }
    const groups = [...facet.groups];
    const i = groups.findIndex((g) => {
      return g.id === id;
    });
    if (i === -1) {
      return;
    }
    groups.splice(i, 1);
    this._facets$.next(
      this._facets$.value.map((f) =>
        f.id === facetId ? { ...facet, groups } : f
      )
    );
  }

  /**
   * Add a new part in the specified facet's group.
   *
   * @param facetId The ID of the facet the parts group belongs to.
   * @param groupId The ID of the group the part belongs to.
   * @param typeId The typeId of the new part.
   */
  public addPart(facetId: string, groupId: string, typeId = 'new'): void {
    // find facet
    const facet = this._facets$.value.find((f) => f.id === facetId);
    if (!facet) {
      return;
    }
    // find facet's group
    const groups = [...facet.groups];
    const groupIndex = groups.findIndex((g) => {
      return g.id === groupId;
    });
    if (groupIndex === -1) {
      return;
    }
    // add a new part to that group
    groups[groupIndex].partDefinitions = [
      ...groups[groupIndex].partDefinitions,
      {
        scopedId: this._vmService.buildScopedPartId({
          groupId: groupId,
          typeId: typeId,
        }),
        typeId: typeId,
        roleId: '',
        name: typeId,
        description: '',
        sortKey: typeId,
        isRequired: false,
        groupKey: '',
        colorKey: '#808080',
      },
    ];
    // update groups in facet
    this._facets$.next(
      this._facets$.value.map((f) =>
        f.id === facetId ? { ...facet, groups } : f
      )
    );
  }

  /**
   * Move a part inside a facet, from the specified position in a source
   * group to the specified position in a target group.
   *
   * @param facetId The ID of the facet groups belong to.
   * @param fromGroupId The ID of the source group.
   * @param from The source index in the source group.
   * @param toGroupId The ID of the target group.
   * @param to: The target index in the target group.
   */
  public movePart(
    facetId: string,
    fromGroupId: string,
    from: number,
    toGroupId: string,
    to: number
  ): void {
    // find facet
    const facet = this._facets$.value.find((f) => f.id === facetId);
    if (!facet) {
      return;
    }
    // find facet's source group
    const editableFacet = deepCopy(facet) as GroupingFacet;

    const groups = [...editableFacet.groups];
    const gFrom = groups.findIndex((g) => {
      return g.id === fromGroupId;
    });
    if (gFrom === -1) {
      return;
    }
    const gTo =
      fromGroupId === toGroupId
        ? gFrom
        : groups.findIndex((g) => {
            return g.id === toGroupId;
          });
    if (gTo === -1) {
      return;
    }

    // move part
    if (gFrom === gTo) {
      moveItemInArray(editableFacet.groups[gFrom].partDefinitions, from, to);
    } else {
      transferArrayItem(
        editableFacet.groups[gFrom].partDefinitions,
        editableFacet.groups[gTo].partDefinitions,
        from,
        to
      );
    }

    // update facet
    this._facets$.next(
      this._facets$.value.map((f) =>
        f.id === facetId ? { ...editableFacet } : f
      )
    );
  }

  /**
   * Delete a part in the specified facet's group.
   *
   * @param facetId The ID of the facet the group belongs to.
   * @param groupId The ID of the group the part belongs to.
   * @param index The index of the part in the group.
   */
  public deletePart(facetId: string, groupId: string, index: number): void {
    // find facet
    const facet = this._facets$.value.find((f) => f.id === facetId);
    if (!facet) {
      return;
    }
    // find facet's group
    const groups = [...facet.groups];
    const groupIndex = groups.findIndex((g) => {
      return g.id === groupId;
    });
    if (groupIndex === -1) {
      return;
    }
    // remove part from that group
    groups[groupIndex].partDefinitions.splice(index, 1);
    // update groups
    this._facets$.next(
      this._facets$.value.map((f) =>
        f.id === facetId ? { ...facet, groups } : f
      )
    );
  }

  /**
   * Assign a new random color to all the parts in the specified
   * facet's group.
   *
   * @param facetId The ID of the facet the group belongs to.
   * @param groupId The ID of the group.
   */
  public colorizeGroup(facetId: string, groupId: string): void {
    // find facet
    const facet = this._facets$.value.find((f) => f.id === facetId);
    if (!facet) {
      return;
    }
    // find facet's group
    const groups = [...facet.groups];
    const groupIndex = groups.findIndex((g) => {
      return g.id === groupId;
    });
    if (groupIndex === -1) {
      return;
    }
    // recolor all its parts
    const parts = [...groups[groupIndex].partDefinitions];
    for (let i = 0; i < parts.length; i++) {
      parts[i].colorKey = this._colorService.nextPaletteColor(i, parts.length);
    }
    groups[groupIndex].partDefinitions = parts;
    // update
    this._facets$.next(
      this._facets$.value.map((f) =>
        f.id === facetId ? { ...facet, groups } : f
      )
    );
  }
}
