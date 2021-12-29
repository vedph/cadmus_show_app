import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { FacetListQuery, GroupingFacet } from '@myrmidon/cadmus-profile-ui';
import { deepCopy } from '@myrmidon/ng-tools';

@Component({
  selector: 'app-facet-list-page',
  templateUrl: './facet-list-page.component.html',
  styleUrls: ['./facet-list-page.component.css'],
})
export class FacetListPageComponent implements OnInit {
  public facets$: Observable<GroupingFacet[]>;

  constructor(query: FacetListQuery) {
    this.facets$ = query.selectAll().pipe(
      map((facets) => {
        return facets.map((f) => {
          return deepCopy(f);
        });
      })
    );
  }

  ngOnInit(): void {}
}
