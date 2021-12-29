import { moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Injectable } from '@angular/core';
import { FacetDefinition } from '@myrmidon/cadmus-core';
import { ColorService } from '@myrmidon/cadmus-show-ui';
import { deepCopy } from '@myrmidon/ng-tools';
import { PartDefinitionVmService } from '../../../services/part-definition-vm.service';
import { FacetListQuery } from './facet-list.query';
import {
  FacetListStore,
  GroupingFacet,
  PartDefinitionGroup,
} from './facet-list.store';

/**
 * Service used to write data into the facets list store.
 */
@Injectable({
  providedIn: 'root',
})
export class FacetListService {
  constructor(
    private _store: FacetListStore,
    private _query: FacetListQuery,
    private _vmService: PartDefinitionVmService,
    private _colorService: ColorService
  ) {}

  /**
   * Set the list of facets.
   *
   * @param facets The facets definitions.
   */
  public set(facets: FacetDefinition[]): void {
    // map each facet into a GroupingFacet
    const groupingFacets = this._vmService.getFacetGroups(facets);
    this._store.set(groupingFacets);
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
    this._store.add(facet);
    this._store.setActive(facet.id);
  }

  /**
   * Update the metadata of the specified facet.
   *
   * @param facet The new facet's metadata.
   */
  public updateFacetMetadata(facet: FacetDefinition): void {
    this._store.update(facet.id, {
      label: facet.label,
      colorKey: facet.colorKey,
      description: facet.description,
    });
  }

  /**
   * Move the facet from the specified index to the specified index.
   *
   * @param from The source index.
   * @param to The target index.
   */
  public moveFacet(from: number, to: number): void {
    this._store.move(from, to);
  }

  /**
   * Delete the facet with the specified ID.
   *
   * @param id The facet's ID.
   */
  public deleteFacet(id: string): void {
    this._store.remove(id);
  }

  /**
   * Add a new group to the facet with the specified ID.
   *
   * @param facetId The ID of the facet the group belongs to.
   * @param id The new group ID.
   */
  public addGroup(facetId: string, id = 'new'): void {
    const facet = this._query.getEntity(facetId);
    if (!facet) {
      return;
    }
    const group: PartDefinitionGroup = {
      id: id,
      partDefinitions: [],
    };
    this._store.update(facetId, {
      groups: [...facet.groups, group],
    });
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
    const facet = this._query.getEntity(facetId);
    if (!facet) {
      return;
    }
    const groups = [...facet.groups];
    moveItemInArray(groups, from, to);

    this._store.update(facetId, {
      groups: groups,
    });
  }

  /**
   * Remove the group with the specified ID from the facet with the
   * specified ID.
   *
   * @param facetId The ID of the facet the group belongs to.
   * @param id The group's ID.
   */
  public deleteGroup(facetId: string, id: string): void {
    const facet = this._query.getEntity(facetId);
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
    this._store.update(facetId, {
      groups: groups,
    });
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
    const facet = this._query.getEntity(facetId);
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
    // update groups
    this._store.update(facetId, {
      groups: groups,
    });
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
    const facet = this._query.getEntity(facetId);
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
    this._store.update(facetId, editableFacet);
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
    const facet = this._query.getEntity(facetId);
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
    this._store.update(facetId, {
      groups: groups,
    });
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
    const facet = this._query.getEntity(facetId);
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
    this._store.update(facetId, {
      groups: groups,
    });
  }
}
