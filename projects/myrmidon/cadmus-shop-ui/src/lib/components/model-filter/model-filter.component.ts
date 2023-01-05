import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';

import { CadmusModelFilter } from '@myrmidon/cadmus-shop-core';

import { ModelListRepository } from '../model-list/model-list.repository';

@Component({
  selector: 'cadmus-model-filter',
  templateUrl: './model-filter.component.html',
  styleUrls: ['./model-filter.component.scss'],
})
export class ModelFilterComponent implements OnInit {
  public filter$: Observable<CadmusModelFilter>;

  public fragment: FormControl<boolean>;
  public project: FormControl<string | null>;
  public typeId: FormControl<string | null>;
  public name: FormControl<string | null>;
  public tags: FormControl<string | null>;
  public matchAny: FormControl<boolean>;
  public form: FormGroup;

  constructor(
    formBuilder: FormBuilder,
    private _repository: ModelListRepository
  ) {
    this.filter$ = _repository.filter$;
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
  }

  public ngOnInit(): void {
    this.filter$.subscribe((f) => {
      this.updateForm(f);
    });
  }

  private updateForm(filter: CadmusModelFilter): void {
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
    const filter = this.getFilter();

    // update filter in state
    this._repository.setFilter(filter);
  }
}
