import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { ThesaurusFilter } from '@myrmidon/cadmus-core';

@Component({
  selector: 'cadmus-thesaurus-filter',
  templateUrl: './thesaurus-filter.component.html',
  styleUrls: ['./thesaurus-filter.component.css'],
})
export class ThesaurusFilterComponent implements OnInit {
  private _filter: ThesaurusFilter | undefined | null;

  @Input()
  public get filter(): ThesaurusFilter | undefined | null {
    return this._filter;
  }
  public set filter(value: ThesaurusFilter | undefined | null) {
    this._filter = value;
    this.updateForm(value);
  }

  @Output()
  public filterChange: EventEmitter<ThesaurusFilter>;

  public id: FormControl;
  public alias: FormControl;
  public language: FormControl;
  public form: FormGroup;

  constructor(formBuilder: FormBuilder) {
    this.filterChange = new EventEmitter<ThesaurusFilter>();
    // form
    this.id = formBuilder.control('id');
    this.alias = formBuilder.control(null);
    this.language = formBuilder.control(
      null,
      Validators.pattern(/^[a-z]{2,3}$/g)
    );
    this.form = formBuilder.group({
      id: this.id,
      alias: this.alias,
      language: this.language,
    });
  }

  public ngOnInit(): void {
    this.updateForm(this._filter);
  }

  private updateForm(filter?: ThesaurusFilter | null): void {
    if (!filter) {
      this.form.reset();
      return;
    }

    this.id.setValue(filter.id);
    this.alias.setValue(filter.isAlias);
    this.language.setValue(filter.language);
    this.form.markAsPristine();
  }

  private getFilter(): ThesaurusFilter {
    return {
      pageNumber: 0,
      pageSize: 0,
      id: this.id.value,
      isAlias: this.alias.value,
      language: this.language.value,
    };
  }

  public reset(): void {
    this.form.reset();
    this.apply();
  }

  public apply(): void {
    if (this.form.invalid) {
      return;
    }
    this.filterChange.emit(this.getFilter());
  }
}
