import { Component, OnInit } from '@angular/core';
import { deepCopy, FlagDefinition } from '@myrmidon/cadmus-core';
import { FlagListQuery } from '@myrmidon/cadmus-profile-ui';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-flag-list-page',
  templateUrl: './flag-list-page.component.html',
  styleUrls: ['./flag-list-page.component.css'],
})
export class FlagListPageComponent implements OnInit {
  public flags$: Observable<FlagDefinition[]>;

  constructor(query: FlagListQuery) {
    this.flags$ = query.selectAll().pipe(
      map((flags) => {
        return flags.map((f) => {
          return deepCopy(f);
        });
      })
    );
  }

  ngOnInit(): void {}
}
