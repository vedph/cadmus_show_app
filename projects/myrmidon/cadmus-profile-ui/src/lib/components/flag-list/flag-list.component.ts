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
  public flag$: Observable<FlagDefinition | undefined>;

  constructor(private _flService: FlagListService, flQuery: FlagListQuery) {
    this.flags$ = flQuery.selectAll();
    this.flag$ = flQuery.selectActive();
  }

  ngOnInit(): void {}

  public addFlag(): void {
    this._flService.addFlag();
  }

  public deleteFlag(id: number): void {
    this._flService.deleteFlag(id);
  }

  public editFlag(flag: FlagDefinition): void {
    this._flService.setActive(flag.id);
  }

  public onCloseFlag(): void {
    this._flService.setActive(null);
  }

  public onFlagChange(flag: FlagDefinition): void {
    this._flService.updateFlag(flag);
    this._flService.setActive(null);
  }
}
