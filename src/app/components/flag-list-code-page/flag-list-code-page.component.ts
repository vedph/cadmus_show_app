import { Component } from '@angular/core';
import { CadmusShopAssetService } from '@myrmidon/cadmus-shop-asset';
import { FlagListQuery, FlagListService } from '@myrmidon/cadmus-profile-ui';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { FlagDefinition } from '@myrmidon/cadmus-core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-flag-list-code-page',
  templateUrl: './flag-list-code-page.component.html',
  styleUrls: ['./flag-list-code-page.component.css'],
})
export class FlagListCodePageComponent {
  public data$: Observable<FlagDefinition[]>;

  constructor(
    flagListQuery: FlagListQuery,
    private _flagListService: FlagListService,
    private _shopService: CadmusShopAssetService,
    private _snackbar: MatSnackBar
  ) {
    this.data$ = flagListQuery.selectAll();
  }

  public loadSample(): void {
    this._shopService
      .loadObject<FlagDefinition[]>('samples/flags')
      .pipe(take(1))
      .subscribe((flags) => {
        this._flagListService.set(flags);
      });
  }

  public onDataChange(data: FlagDefinition[]): void {
    this._flagListService.set(data);
    this._snackbar.open('Flags saved', 'OK', {
      duration: 1500,
    });
  }
}
