import { Injectable } from '@angular/core';
import { FacetDefinition, PartDefinition } from '@myrmidon/cadmus-core';
import { ProfileUtilService } from '@myrmidon/cadmus-profile-core';
import {
  GroupedPartDefinition,
  GroupedPartDefinitionId,
  GroupingFacet,
  PartDefinitionGroup,
} from '../components/facet-list/store/facet-list.store';

/**
 * The ID for a part in the scope of its group.
 */
export interface ScopedPartId {
  groupIndex: number;
  typeId: string;
  roleId?: string;
}

/**
 * Utility service for part definition viewmodels.
 */
@Injectable({
  providedIn: 'root',
})
export class PartDefinitionVmService {
  constructor(private _profUtil: ProfileUtilService) {}

  public buildScopedPartId(groupIndex: number, part: PartDefinition): string {
    const sb: string[] = [];
    sb.push(groupIndex.toString());
    sb.push(':');
    sb.push(part.typeId);
    if (part.roleId) {
      sb.push('@');
      sb.push(part.roleId);
    }
    return sb.join('');
  }

  public parseScopedPartId(id: string): ScopedPartId {
    const ci = id.indexOf(':');
    const groupIndex = +id.substr(0, ci);

    const ai = id.indexOf('@');
    const typeId = id.substr(ci + 1, ai > -1 ? ai - 1 - ci : undefined);
    const roleId = ai > -1 ? id.substr(ai + 1) : undefined;
    return {
      groupIndex: groupIndex,
      typeId: typeId,
      roleId: roleId,
    };
  }

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
   * Maps a grouping facet into a flat list of part definitions.
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
}
