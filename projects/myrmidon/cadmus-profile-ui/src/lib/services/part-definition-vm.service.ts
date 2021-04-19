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

  /**
   * Build the ID for the specified part definition in its group.
   *
   * @param part The part definition.
   */
  public buildScopedPartId(id: GroupedPartDefinitionId): string {
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
  public parseScopedPartId(id: string): GroupedPartDefinitionId {
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
            scopedId: this.buildScopedPartId({
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
   * Get an array of GroupingFacet's from the specified array of
   * FacetDefinition's.
   *
   * @param facets The facets definitions.
   * @returns Array of grouping facets.
   */
  public getFacetGroups(facets: FacetDefinition[]): GroupingFacet[] {
    return facets.map((d, i) => {
      return {
        id: d.id,
        index: i,
        label: d.label,
        description: d.description,
        colorKey: d.colorKey,
        groups: this.getFacetPartGroups(d),
      };
    });
  }

  /**
   * Maps a grouping facet into a flat list of part definitions.
   *
   * @param facet The grouping facet.
   * @returns The part definitions.
   */
  public getPartDefsFromGroup(facet: GroupingFacet): PartDefinition[] {
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
   * Get a facet definition from a grouping facet.
   *
   * @param facet The grouping facet.
   * @returns The facet definition.
   */
  public getFacetDefFromGroup(facet: GroupingFacet): FacetDefinition {
    return {
      id: facet.id,
      label: facet.label,
      colorKey: facet.colorKey || '',
      description: facet.description,
      partDefinitions: this.getPartDefsFromGroup(facet)
    };
  }
}
