import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-thesaurus-edit',
  templateUrl: './thesaurus-edit.component.html',
  styleUrls: ['./thesaurus-edit.component.css'],
})
export class ThesaurusEditComponent implements OnInit {
  public id: string;

  constructor(private _route: ActivatedRoute, private _router: Router) {
    // get the edited thesaurus ID from the route
    this.id = this._route.snapshot.params.id;
    if (this.id === 'new') {
      this.id = '';
    }
  }

  ngOnInit(): void {}

  public onEditorClose(): void {
    this._router.navigate(['/thes-list']);
  }
}
