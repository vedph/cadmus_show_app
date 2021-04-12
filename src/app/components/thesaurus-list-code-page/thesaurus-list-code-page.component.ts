import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Thesaurus } from '@myrmidon/cadmus-core';
import {
  RamThesaurusService,
  ThesaurusListQuery,
} from '@myrmidon/cadmus-profile-ui';
import { CadmusShopAssetService } from '@myrmidon/cadmus-shop-asset';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-thesaurus-list-code-page',
  templateUrl: './thesaurus-list-code-page.component.html',
  styleUrls: ['./thesaurus-list-code-page.component.css'],
})
export class ThesaurusListCodePageComponent {
  public data$: Observable<Thesaurus[]>;

  constructor(
    private _thesListQuery: ThesaurusListQuery,
    private _thesListService: RamThesaurusService,
    private _shopService: CadmusShopAssetService,
    private _snackbar: MatSnackBar
  ) {
    this.data$ = this._thesListQuery.selectAll();
  }

  public loadSample(): void {
    this._shopService
      .loadObject<string>('samples/thesauri')
      .pipe(take(1))
      .subscribe((s) => {
        const thesauri = JSON.parse(s);
        this._thesListService.setAll(thesauri);
      });
  }

  public onDataChange(data: Thesaurus[]): void {
    this._thesListService.setAll(data);
    this._snackbar.open('Thesauri saved', 'OK', {
      duration: 1500,
    });
  }
}
