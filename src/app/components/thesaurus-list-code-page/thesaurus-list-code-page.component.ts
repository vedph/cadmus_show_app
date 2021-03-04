import { Component, OnInit } from '@angular/core';
import { CadmusShopAssetService } from 'projects/myrmidon/cadmus-shop-asset/src/public-api';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-thesaurus-list-code-page',
  templateUrl: './thesaurus-list-code-page.component.html',
  styleUrls: ['./thesaurus-list-code-page.component.css']
})
export class ThesaurusListCodePageComponent {
  public code: string;

  constructor(private _shopService: CadmusShopAssetService) {
    this.code = '[]';
  }

  public loadSample(): void {
    this._shopService
      .loadObject<string>('samples/thesauri')
      .pipe(take(1))
      .subscribe((s) => {
        this.code = s;
      });
  }
}
