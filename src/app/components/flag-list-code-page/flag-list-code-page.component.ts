import { Component } from '@angular/core';
import { CadmusShopAssetService } from '@myrmidon/cadmus-shop-asset';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-flag-list-code-page',
  templateUrl: './flag-list-code-page.component.html',
  styleUrls: ['./flag-list-code-page.component.css'],
})
export class FlagListCodePageComponent {
  public code: string;

  constructor(private _shopService: CadmusShopAssetService) {
    this.code = '[]';
  }

  public loadSample(): void {
    this._shopService
      .loadObject<string>('samples/flags')
      .pipe(take(1))
      .subscribe((s) => {
        this.code = s;
      });
  }
}
