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

/**
 * A flag definition.
 */
export interface FlagDefinition {
  id: number;
  label: string;
  description: string;
  colorKey: string;
}

/**
 * A single entry in a thesaurus.
 */
export interface ThesaurusEntry {
  id: string;
  value: string;
}

/**
 * A set of thesaurus entries.
 */
export interface Thesaurus {
  id: string;
  language: string;
  targetId?: string;
  entries?: ThesaurusEntry[];
}

/**
 * Filter for thesauri.
 */
export interface ThesaurusFilter {
  pageNumber: number;
  pageSize: number;
  id?: string;
  isAlias?: boolean;
  language?: string;
}
