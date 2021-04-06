import { Output } from '@angular/core';
import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { CadmusModelFilter } from '@myrmidon/cadmus-shop-core';

@Component({
  selector: 'cadmus-model-filter',
  templateUrl: './model-filter.component.html',
  styleUrls: ['./model-filter.component.css'],
})
export class ModelFilterComponent implements OnInit {
  private _filter: CadmusModelFilter | undefined | null;

  @Input()
  public get filter(): CadmusModelFilter | undefined | null {
    return this._filter;
  }
  public set filter(value: CadmusModelFilter | undefined | null) {
    this._filter = value;
    this.updateForm(value);
  }

  @Output()
  public filterChange: EventEmitter<CadmusModelFilter>;

  public project: FormControl;
  public typeId: FormControl;
  public name: FormControl;
  public tags: FormControl;
  public matchAny: FormControl;
  public form: FormGroup;

  constructor(formBuilder: FormBuilder) {
    this.filterChange = new EventEmitter<CadmusModelFilter>();
    // form
    this.project = formBuilder.control(null);
    this.typeId = formBuilder.control(null);
    this.name = formBuilder.control(null);
    this.tags = formBuilder.control(null);
    this.matchAny = formBuilder.control(null);
    this.form = formBuilder.group({
      project: this.project,
      typeId: this.typeId,
      name: this.name,
      tags: this.tags,
      matchAny: this.matchAny,
    });
  }

  public ngOnInit(): void {
    this.updateForm(this._filter);
  }

  private updateForm(filter?: CadmusModelFilter | null): void {
    if (!filter) {
      this.form.reset();
      return;
    }

    this.project.setValue(filter.project);
    this.typeId.setValue(filter.typeId);
    this.name.setValue(filter.name);
    this.tags.setValue(filter.tags?.length ? filter.tags.join(' ') : null);
    this.matchAny.setValue(filter.matchAny);
    this.form.markAsPristine();
  }

  private getFilter(): CadmusModelFilter {
    return {
      pageNumber: 0,
      pageSize: 0,
      project: this.project.value?.trim(),
      typeId: this.typeId.value?.trim(),
      name: this.name.value,
      tags: this.tags.value ? this.tags.value.split(' ') : undefined,
      matchAny: this.matchAny.value,
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
