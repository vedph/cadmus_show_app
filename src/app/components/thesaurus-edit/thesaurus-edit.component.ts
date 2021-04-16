import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Thesaurus } from '@myrmidon/cadmus-core';
import { RamThesaurusService } from '@myrmidon/cadmus-profile-ui';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-thesaurus-edit',
  templateUrl: './thesaurus-edit.component.html',
  styleUrls: ['./thesaurus-edit.component.css'],
})
export class ThesaurusEditComponent implements OnInit {
  public thesaurus: Thesaurus | undefined;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _snackbar: MatSnackBar,
    private _thesService: RamThesaurusService
  ) {
    // get the edited thesaurus ID from the route
    let id = this._route.snapshot.params.id;
    this.loadThesaurus(id);
  }

  ngOnInit(): void {}

  private loadThesaurus(id: string): void {
    this._thesService.get(id).subscribe((t) => {
      this.thesaurus = t || {
        id: id,
        language: 'en',
        entries: [],
      };
    });
  }

  public onThesaurusChange(thesaurus: Thesaurus): void {
    this.thesaurus = thesaurus;
    this._thesService
      .addThesaurus(thesaurus)
      .pipe(take(1))
      .subscribe((t) => {
        this._snackbar.open('Thesaurus saved', 'OK', {
          duration: 1500,
        });
      });
  }

  public onEditorClose(): void {
    this._router.navigate(['/thes-list']);
  }
}
