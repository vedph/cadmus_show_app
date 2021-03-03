import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { FlagDefinition } from 'projects/myrmidon/cadmus-profile-core/src/public-api';
import { DialogService } from 'projects/myrmidon/cadmus-show-ui/src/public-api';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { FlagListQuery } from './store/flag-list.query';
import { FlagListService } from './store/flag-list.service';

@Component({
  selector: 'cadmus-flag-list',
  templateUrl: './flag-list.component.html',
  styleUrls: ['./flag-list.component.css'],
  animations: [
    trigger('inOutAnimation', [
      transition(':enter', [
        style({ height: 0, opacity: 0 }),
        animate('1s ease-out', style({ height: '100%', opacity: 1 })),
      ]),
      transition(':leave', [
        style({ height: 300, opacity: 1 }),
        animate('0.5s ease-in', style({ height: 0, opacity: 0 })),
      ]),
    ]),
  ],
})
export class FlagListComponent implements OnInit {
  public flags$: Observable<FlagDefinition[]>;
  public flag$: Observable<FlagDefinition | undefined>;

  constructor(
    private _flService: FlagListService,
    flQuery: FlagListQuery,
    private _dialogService: DialogService
  ) {
    this.flags$ = flQuery.selectAll();
    this.flag$ = flQuery.selectActive();
  }

  ngOnInit(): void {}

  public addFlag(): void {
    this._flService.addFlag();
  }

  public deleteFlag(id: number): void {
    this._dialogService
      .confirm('Confirmation', 'Delete this flag?')
      .pipe(take(1))
      .subscribe((yes) => {
        if (yes) {
          this._flService.deleteFlag(id);
        }
      });
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
