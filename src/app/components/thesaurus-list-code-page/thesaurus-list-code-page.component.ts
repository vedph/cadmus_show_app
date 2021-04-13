import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Thesaurus } from '@myrmidon/cadmus-core';
import { RamThesaurusService } from '@myrmidon/cadmus-profile-ui';
import { CadmusShopAssetService } from '@myrmidon/cadmus-shop-asset';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

/**
 * Code editor for the whole set of thesauri.
 * Note that this differs from the thesaurus list, where thesauri
 * are paged. Thus, we are not using the thesauri store here, but
 * directly a RAM thesaurus service, with all the thesauri loaded
 * from a local resource, or just built from scratch.
 */
@Component({
  selector: 'app-thesaurus-list-code-page',
  templateUrl: './thesaurus-list-code-page.component.html',
  styleUrls: ['./thesaurus-list-code-page.component.css'],
})
export class ThesaurusListCodePageComponent {
  public data$: Observable<Thesaurus[]>;

  constructor(
    private _thesService: RamThesaurusService,
    private _shopService: CadmusShopAssetService,
    private _snackbar: MatSnackBar,
    private _router: Router
  ) {
    this.data$ = this._thesService.thesauri$;
  }

  public loadSample(): void {
    this._shopService
      .loadObject<Thesaurus[]>('samples/thesauri')
      .pipe(take(1))
      .subscribe((thesauri) => {
        this._thesService.setAll(thesauri);
      });
  }

  public onDataChange(data: Thesaurus[]): void {
    this._thesService.setAll(data);
    this._snackbar.open('Thesauri saved', 'OK', {
      duration: 1500,
    });
    this._router.navigate(['/profile'], { queryParams: { step: 3 } });
  }
}
