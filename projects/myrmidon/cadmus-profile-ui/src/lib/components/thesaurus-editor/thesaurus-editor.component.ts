import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'cadmus-thesaurus-editor',
  templateUrl: './thesaurus-editor.component.html',
  styleUrls: ['./thesaurus-editor.component.css']
})
export class ThesaurusEditorComponent implements OnInit {
  public filter: FormControl;
  public parentId: FormControl;
  public form: FormGroup;

  constructor(formBuilder: FormBuilder) {
    this.filter = formBuilder.control(null);
    this.parentId = formBuilder.control(null);
    this.form = formBuilder.group({
      filter: this.filter,
      parentId: this.parentId
    });
  }

  ngOnInit(): void {
  }
}
