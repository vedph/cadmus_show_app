import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Thesaurus, ThesaurusEntry } from '@myrmidon/cadmus-core';
import { RamThesaurusService } from '@myrmidon/cadmus-profile-ui';
import { CadmusShopAssetService } from '@myrmidon/cadmus-shop-asset';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-taxonomies-page',
  templateUrl: './taxonomies-page.component.html',
  styleUrls: ['./taxonomies-page.component.css'],
})
export class TaxonomiesPageComponent implements OnInit {
  public entries: ThesaurusEntry[] | undefined;

  constructor(
    private _shopService: CadmusShopAssetService,
    private _thesService: RamThesaurusService,
    private _snackbar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this._shopService
      .loadObject<Thesaurus[]>('samples/thesauri')
      .pipe(take(1))
      .subscribe((thesauri: Thesaurus[]) => {
        this._thesService.setAll(thesauri);
        this._thesService
          .get('ms-script-types@en')
          .pipe(take(1))
          .subscribe((t: Thesaurus | undefined) => {
            this.entries = t?.entries;
          });
      });
  }

  public onEntryChange(entry: ThesaurusEntry): void {
    this._snackbar.open('You picked ' + entry.value, 'OK', {
      duration: 1000,
    });
  }
}
