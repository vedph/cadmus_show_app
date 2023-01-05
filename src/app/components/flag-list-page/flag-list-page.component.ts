import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { FlagDefinition } from '@myrmidon/cadmus-core';
import { FlagListRepository } from '@myrmidon/cadmus-profile-ui';
import { deepCopy } from '@myrmidon/ng-tools';

@Component({
  selector: 'app-flag-list-page',
  templateUrl: './flag-list-page.component.html',
  styleUrls: ['./flag-list-page.component.scss'],
})
export class FlagListPageComponent implements OnInit {
  public flags$: Observable<FlagDefinition[]>;

  constructor(
    private _repository: FlagListRepository,
    private _snackbar: MatSnackBar,
    private _router: Router
  ) {
    this.flags$ = _repository.flags$.pipe(
      map((flags) => {
        return flags.map((f) => {
          return deepCopy(f);
        });
      })
    );
  }

  ngOnInit(): void {}

  public onFlagsChange(flags: FlagDefinition[]): void {
    this._repository.setFlags(flags);
    this._snackbar.open('Flags saved', 'OK', {
      duration: 1500,
    });
    this._router.navigate(['/profile/flow'], { queryParams: { step: 2 } });
  }
}
