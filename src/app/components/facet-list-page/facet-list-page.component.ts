import { Component, OnInit } from '@angular/core';
import { deepCopy } from '@myrmidon/cadmus-core';
import { FacetListQuery, GroupingFacet } from '@myrmidon/cadmus-profile-ui';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

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
