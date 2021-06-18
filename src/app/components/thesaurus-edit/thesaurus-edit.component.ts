import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Thesaurus, ThesaurusFilter } from '@myrmidon/cadmus-core';
import { RamThesaurusService } from '@myrmidon/cadmus-profile-ui';
import { Observable } from 'rxjs';
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
    public thesService: RamThesaurusService
  ) {
    // get the edited thesaurus ID from the route
    let id = this._route.snapshot.params.id;
    this.loadThesaurus(id);
  }

  ngOnInit(): void {}

  public wrapLookup(service: RamThesaurusService) {
    return (filter?: ThesaurusFilter): Observable<string[]> => {
      return service.getThesaurusIds(filter);
    };
  }

  private loadThesaurus(id: string): void {
    this.thesService.get(id).subscribe((t) => {
      this.thesaurus = t || {
        id: id,
        language: 'en',
        entries: [],
      };
    });
  }

  public onThesaurusChange(thesaurus: Thesaurus): void {
    this.thesaurus = thesaurus;
    this.thesService
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
