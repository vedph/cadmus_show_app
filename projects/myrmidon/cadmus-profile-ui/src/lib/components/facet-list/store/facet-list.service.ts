import { moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Injectable } from '@angular/core';
import {
  deepCopy,
  FacetDefinition,
  PartDefinition,
} from '@myrmidon/cadmus-core';
import { ProfileUtilService } from '@myrmidon/cadmus-profile-core';
import { ColorService } from '@myrmidon/cadmus-show-ui';
import { FacetListQuery } from './facet-list.query';
import {
  FacetListStore,
  GroupedPartDefinition,
  GroupedPartDefinitionId,
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
    private _profUtil: ProfileUtilService,
    private _colorService: ColorService
  ) {}

  /**
   * Build the ID for the specified part definition in its group.
   *
   * @param part The part definition.
   */
  public buildPartId(id: GroupedPartDefinitionId): string {
    const sb: string[] = [];
    sb.push(id.groupId || '-');
    sb.push(':');
    sb.push(id.typeId);
    if (id.roleId) {
      sb.push('@');
      sb.push(id.roleId);
    }
    return sb.join('');
  }

  /**
   * Parse the part definition ID built by buildPartId.
   *
   * @param id The part ID.
   * @returns An object with groupId, typeId, roleId.
   */
  public parsePartId(id: string): GroupedPartDefinitionId {
    const ci = id.indexOf(':');
    const groupId = id.substr(0, ci);

    const ai = id.indexOf('@');
    const typeId = id.substr(ci + 1, ai > -1 ? ai - ci : undefined);
    const roleId = ai > -1 ? id.substr(ai + 1) : undefined;

    return {
      groupId: groupId,
      typeId: typeId,
      roleId: roleId,
    };
  }

  /**
   * Get the parts groups from the specified part definition.
   *
   * @param facet The facet definition.
   */
  public getFacetPartGroups(facet: FacetDefinition): PartDefinitionGroup[] {
    // map the facet's part definitions into grouped part definitions,
    // setting the scopedId of each part to a combination of group ID and
    // part type and role IDs.
    const grouped: GroupedPartDefinition[] = facet.partDefinitions.map(
      (d: PartDefinition) => {
        return Object.assign(
          {
            scopedId: this.buildPartId({
              groupId: d.groupKey || '',
              typeId: d.typeId,
              roleId: d.roleId,
            }),
          },
          d
        );
      }
    );

    // effectively group these part definitions
    const groups = this._profUtil.groupIntoKeyedGroups<GroupedPartDefinition>(
      grouped,
      ['groupKey']
    );

    // map the groups into an array of PartDefinitionGroup's
    return groups.map((g, i) => {
      return { id: g.key, index: i, partDefinitions: g.items };
    });
  }

  /**
   * Set the list of facets.
   *
   * @param facets The facets definitions.
   */
  public set(facets: FacetDefinition[]): void {
    // map each facet into a GroupingFacet
    const groupingFacets = facets.map((d, i) => {
      return {
        id: d.id,
        index: i,
        label: d.label,
        description: d.description,
        colorKey: d.colorKey,
        groups: this.getFacetPartGroups(d),
      };
    });

    this._store.set(groupingFacets);
  }

  /**
   * Maps the received grouping facet into part definitions.
   *
   * @param facet The grouping facet.
   * @returns The part definitions.
   */
  public getPartDefsFromGroupingFacet(facet: GroupingFacet): PartDefinition[] {
    const defs: PartDefinition[] = [];
    facet.groups.forEach((g) => {
      g.partDefinitions.forEach((gd) => {
        defs.push({
          typeId: gd.typeId,
          roleId: gd.roleId,
          name: gd.name,
          description: gd.description,
          isRequired: gd.isRequired,
          colorKey: gd.colorKey,
          groupKey: gd.groupKey,
          sortKey: gd.sortKey,
        });
      });
    });
    return defs;
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
        scopedId: this.buildPartId({
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
