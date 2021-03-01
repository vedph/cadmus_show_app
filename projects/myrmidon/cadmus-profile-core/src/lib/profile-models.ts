/**
 * A part definition.
 */
export interface PartDefinition {
  typeId: string;
  roleId?: string;
  name: string;
  description: string;
  isRequired?: boolean;
  colorKey?: string;
  groupKey?: string;
  sortKey: string;
}

/**
 * A facet definition.
 */
export interface FacetDefinition {
  id: string;
  label: string;
  description: string;
  colorKey?: string;
  partDefinitions: PartDefinition[];
}
