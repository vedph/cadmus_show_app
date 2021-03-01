import { Component, OnInit } from '@angular/core';
import { CadmusShopAssetService } from 'projects/myrmidon/cadmus-shop-asset/src/public-api';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-facet-list-code-page',
  templateUrl: './facet-list-code-page.component.html',
  styleUrls: ['./facet-list-code-page.component.css'],
})
export class FacetListCodePageComponent {
  public code: string;

  constructor(private _shopService: CadmusShopAssetService) {
    this.code = '[]';
  }

  public loadSample(): void {
    this._shopService
      .loadObject<string>('samples/facets')
      .pipe(take(1))
      .subscribe((s) => {
        this.code = s;
      });
  }
}
