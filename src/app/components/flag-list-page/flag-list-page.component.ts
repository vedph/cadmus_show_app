import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { deepCopy, FlagDefinition } from '@myrmidon/cadmus-core';
import { FlagListQuery, FlagListService } from '@myrmidon/cadmus-profile-ui';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-flag-list-page',
  templateUrl: './flag-list-page.component.html',
  styleUrls: ['./flag-list-page.component.css'],
})
export class FlagListPageComponent implements OnInit {
  public flags$: Observable<FlagDefinition[]>;

  constructor(
    query: FlagListQuery,
    private _flagListService: FlagListService,
    private _snackbar: MatSnackBar,
    private _router: Router
  ) {
    this.flags$ = query.selectAll().pipe(
      map((flags) => {
        return flags.map((f) => {
          return deepCopy(f);
        });
      })
    );
  }

  ngOnInit(): void {}

  public onFlagsChange(flags: FlagDefinition[]): void {
    this._flagListService.set(flags);
    this._snackbar.open('Flags saved', 'OK', {
      duration: 1500,
    });
    this._router.navigate(['/profile'], { queryParams: { step: 2 } });
  }
}
