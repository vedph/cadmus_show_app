import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { deepCopy } from '@myrmidon/ng-tools';
import {
  FacetListRepository,
  GroupingFacet,
} from '@myrmidon/cadmus-profile-ui';

@Component({
  selector: 'app-facet-list-page',
  templateUrl: './facet-list-page.component.html',
  styleUrls: ['./facet-list-page.component.scss'],
})
export class FacetListPageComponent implements OnInit {
  public facets$: Observable<GroupingFacet[]>;

  constructor(repository: FacetListRepository) {
    this.facets$ = repository.facets$.pipe(
      map((facets) => {
        return facets.map((f) => {
          return deepCopy(f);
        });
      })
    );
  }

  ngOnInit(): void {}
}
