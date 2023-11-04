import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { CadmusModelFilter } from '@myrmidon/cadmus-shop-core';

@Component({
  selector: 'cadmus-model-filter',
  templateUrl: './model-filter.component.html',
  styleUrls: ['./model-filter.component.scss'],
})
export class ModelFilterComponent {
  private _filter: CadmusModelFilter | undefined;

  @Input()
  public get filter(): CadmusModelFilter | undefined | null {
    return this._filter;
  }
  public set filter(value: CadmusModelFilter | undefined | null) {
    if (value === this._filter) {
      return;
    }
    this._filter = value || undefined;
    this.updateForm(this._filter);
  }

  @Output()
  public filterChange: EventEmitter<CadmusModelFilter>;

  public fragment: FormControl<boolean>;
  public project: FormControl<string | null>;
  public typeId: FormControl<string | null>;
  public name: FormControl<string | null>;
  public tags: FormControl<string | null>;
  public matchAny: FormControl<boolean>;
  public form: FormGroup;

  constructor(formBuilder: FormBuilder) {
    // form
    this.fragment = formBuilder.control(false, { nonNullable: true });
    this.project = formBuilder.control(null);
    this.typeId = formBuilder.control(null);
    this.name = formBuilder.control(null);
    this.tags = formBuilder.control(null);
    this.matchAny = formBuilder.control(false, { nonNullable: true });
    this.form = formBuilder.group({
      fragment: this.fragment,
      project: this.project,
      typeId: this.typeId,
      name: this.name,
      tags: this.tags,
      matchAny: this.matchAny,
    });
    // events
    this.filterChange = new EventEmitter<CadmusModelFilter>();
  }

  private updateForm(filter?: CadmusModelFilter): void {
    if (!filter) {
      this.form.reset();
      return;
    }

    this.fragment.setValue(filter.fragment || false);
    this.project.setValue(filter.project || null);
    this.typeId.setValue(filter.typeId || null);
    this.name.setValue(filter.name || null);
    this.tags.setValue(filter.tags?.join(' ') || null);
    this.matchAny.setValue(filter.matchAny || false);
    this.form.markAsPristine();
  }

  private getFilter(): CadmusModelFilter {
    return {
      fragment: this.fragment.value,
      project: this.project.value?.trim(),
      typeId: this.typeId.value?.trim(),
      name: this.name.value || undefined,
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
    this._filter = this.getFilter();
  }
}
