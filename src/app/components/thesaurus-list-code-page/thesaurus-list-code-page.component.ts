import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Thesaurus } from '@myrmidon/cadmus-core';
import { CsvThesaurusReader } from '@myrmidon/cadmus-profile-core';
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
  styleUrls: ['./thesaurus-list-code-page.component.scss'],
})
export class ThesaurusListCodePageComponent {
  public data$: Observable<Thesaurus[]>;
  public csvFile: FormControl;
  public csvSeparator: FormControl;
  public form: FormGroup;

  constructor(
    private _thesService: RamThesaurusService,
    private _shopService: CadmusShopAssetService,
    private _snackbar: MatSnackBar,
    private _router: Router,
    formBuilder: FormBuilder
  ) {
    this.data$ = this._thesService.thesauri$;
    this.csvFile = formBuilder.control(null, Validators.required);
    this.csvSeparator = formBuilder.control(',', Validators.required);
    this.form = formBuilder.group({
      csvFile: this.csvFile,
      csvSeparator: this.csvSeparator
    });
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
    this._router.navigate(['/profile/flow'], { queryParams: { step: 3 } });
  }

  private parseSeparator(text: string): string {
    if (!text) {
      return ',';
    }
    return text.replace(new RegExp('U\\+([0-9a-fA-F]{4})', 'g'), (m) => {
      return String.fromCharCode(parseInt(m[1], 16));
    });
  }

  private parseCsv(text: string): void {
    try {
      const thesauri: Thesaurus[] = [];
      const reader = new CsvThesaurusReader(text, {
        fieldSeparator: this.parseSeparator(this.csvSeparator.value)
      });
      let thesaurus: Thesaurus | null;
      while (thesaurus = reader.read()) {
        thesauri.push(thesaurus);
      }
      this._thesService.setAll(thesauri);
    } catch (err) {
      this._snackbar.open('Error parsing CSV', 'OK');
      console.error(JSON.stringify(err));
    }
  }

  public importCsv(): void {
    if (this.form.invalid) {
      return;
    }
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.parseCsv(e.target.result);
    };
    reader.readAsText(this.csvFile.value);
  }
}
