import { Injectable } from '@angular/core';
import {
  FacetDefinition,
  FlagDefinition,
  Thesaurus,
} from '@myrmidon/cadmus-core';

import { PartDefinitionVmService } from './part-definition-vm.service';
import { GroupingFacet } from '../components/facet-list/facet-list.repository';

export interface CadmusProfile {
  facets: FacetDefinition[];
  flags: FlagDefinition[];
  thesauri: Thesaurus[];
}

@Injectable({
  providedIn: 'root',
})
export class ProfileBuilderService {
  constructor(private _partService: PartDefinitionVmService) {}

  public build(
    facets: GroupingFacet[],
    flags: FlagDefinition[],
    thesauri: Thesaurus[]
  ): CadmusProfile {
    return {
      facets: facets.map((f) => this._partService.getFacetDefFromGroup(f)),
      flags: flags || [],
      thesauri: thesauri || [],
    };
  }
}
