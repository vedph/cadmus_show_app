import { Injectable } from '@angular/core';
import {
  ActiveState,
  EntityState,
  EntityStore,
  StoreConfig,
} from '@datorama/akita';
import { PartDefinition } from 'projects/myrmidon/cadmus-profile-core/src/public-api';

// FacetListStore:
// - GroupingFacet (id, label, description, colorKey, groups)
// -- PartDefinitionGroup (id, partDefinitions)
// --- GroupedPartDefinition (scopedId, typeId, roleId, name, description,
// isRequired, colorKey, groupKey, sortKey)

export interface GroupedPartDefinitionId {
  groupId: string;
  typeId: string;
  roleId?: string;
}

/**
 * A part definition inside a group.
 */
export interface GroupedPartDefinition extends PartDefinition {
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

/**
 * The state used by the facets list store.
 */
export interface FacetListState
  extends EntityState<GroupingFacet, string>,
    ActiveState {}

const INITIAL_STATE = {
  active: null
};

/**
 * The facets list store.
 * This contains a list of GroupingFacet's.
 * Each grouping facet has its facet metadata, plus
 * an array of PartDefinitionGroup's.
 * Each of these groups has an array of GroupedPartDefinition's.
 */
@Injectable({
  providedIn: 'root'
})
@StoreConfig({ name: 'facets' })
export class FacetListStore extends EntityStore<FacetListState> {
  constructor() {
    super(INITIAL_STATE);
  }
}
