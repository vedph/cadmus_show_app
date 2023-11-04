import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { CadmusShopAssetService } from '@myrmidon/cadmus-shop-asset';
import { FlagListRepository } from '@myrmidon/cadmus-profile-ui';
import { FlagDefinition } from '@myrmidon/cadmus-core';

@Component({
  selector: 'app-flag-list-code-page',
  templateUrl: './flag-list-code-page.component.html',
  styleUrls: ['./flag-list-code-page.component.scss'],
})
export class FlagListCodePageComponent {
  public data$: Observable<FlagDefinition[]>;

  constructor(
    private _repository: FlagListRepository,
    private _shopService: CadmusShopAssetService,
    private _snackbar: MatSnackBar,
    private _router: Router
  ) {
    this.data$ = _repository.flags$;
  }

  public loadSample(): void {
    this._shopService
      .loadObject<FlagDefinition[]>('samples/flags')
      .pipe(take(1))
      .subscribe((flags) => {
        this._repository.addFlags(flags);
      });
  }

  public onDataChange(data: FlagDefinition[]): void {
    this._repository.addFlags(data);
    this._snackbar.open('Flags saved', 'OK', {
      duration: 1500,
    });
    this._router.navigate(['/profile/flow'], { queryParams: { step: 2 } });
  }
}
