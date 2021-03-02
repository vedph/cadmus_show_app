import { Component, OnInit } from '@angular/core';
import { FlagDefinition } from 'projects/myrmidon/cadmus-profile-core/src/public-api';
import { Observable } from 'rxjs';
import { FlagListQuery } from './store/flag-list.query';
import { FlagListService } from './store/flag-list.service';

@Component({
  selector: 'cadmus-flag-definition-list',
  templateUrl: './flag-list.component.html',
  styleUrls: ['./flag-list.component.css'],
})
export class FlagListComponent implements OnInit {
  public flags$: Observable<FlagDefinition[]>;

  constructor(
    private _flQuery: FlagListQuery,
    private _flService: FlagListService
  ) {
    this.flags$ = _flQuery.selectAll();
  }

  ngOnInit(): void {}

  public addFlag(): void {
    // TODO
  }
}
