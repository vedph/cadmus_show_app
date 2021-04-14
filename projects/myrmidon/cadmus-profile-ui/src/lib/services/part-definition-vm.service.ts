import { Injectable } from '@angular/core';
import { PartDefinition } from '@myrmidon/cadmus-core';

/**
 * The ID for a part in the scope of its group.
 */
export interface ScopedPartId {
  groupIndex: number;
  typeId: string;
  roleId?: string
}

/**
 * Utility service for part definition viewmodels.
 */
@Injectable({
  providedIn: 'root',
})
export class PartDefinitionVmService {
  constructor() {}

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

  public parseScopedPartId(
    id: string
  ): ScopedPartId {
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
}
