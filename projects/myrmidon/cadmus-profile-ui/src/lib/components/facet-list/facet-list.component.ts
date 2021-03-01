import { Component, OnInit } from '@angular/core';
import { deepCopy } from 'projects/myrmidon/cadmus-profile-core/src/lib/utils';
import { FacetDefinition } from 'projects/myrmidon/cadmus-profile-core/src/public-api';
import { FacetListQuery } from './store/facet-list.query';
import { GroupingFacet } from './store/facet-list.store';

@Component({
  selector: 'cadmus-facet-list',
  templateUrl: './facet-list.component.html',
  styleUrls: ['./facet-list.component.css'],
})
export class FacetListComponent implements OnInit {
  private _editedFacetIndex: number;

  public facets: GroupingFacet[];
  public editedFacet: FacetDefinition | undefined;
  public tabIndex: number;

  constructor(query: FacetListQuery) {
    this._editedFacetIndex = -1;
    this.facets = [];
    this.tabIndex = 0;
    // make a copy of each facet as we're making
    // the facets editable
    query.selectAll().subscribe((facets) => {
      this.facets = facets.map((f) => {
        return deepCopy(f);
      });
    });
  }

  ngOnInit(): void {}

  public onEditFacet(facet: GroupingFacet): void {
    this._editedFacetIndex = this.facets.indexOf(facet);
    this.editedFacet = {
      id: facet.id,
      label: facet.label,
      description: facet.description,
      colorKey: facet.colorKey,
      partDefinitions: [],
    };
    setTimeout(() => {
      this.tabIndex = 1;
    }, 300);
  }

  public onFacetChange(facet: FacetDefinition): void {
    if (!this.editedFacet) {
      return;
    }
    this.facets[this._editedFacetIndex] = Object.assign(
      {
        ...this.facets[this._editedFacetIndex],
      },
      facet
    );
  }

  public onFacetEditorClose(): void {
    this.tabIndex = 0;
    this._editedFacetIndex = -1;
    this.editedFacet = undefined;
  }
}
