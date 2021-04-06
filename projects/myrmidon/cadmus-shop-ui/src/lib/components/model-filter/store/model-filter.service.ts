import { Injectable } from '@angular/core';
import { CadmusModelFilter } from '@myrmidon/cadmus-shop-core';
import { ModelFilterStore } from './model-filter.store';

/**
 * Service used to write data into the Cadmus model filter store.
 */
@Injectable({
  providedIn: 'root',
})
export class ModelFilterService {
  constructor(private _store: ModelFilterStore) {}

  public setPage(pageNumber: number, pageSize: number): void {
    this._store.update({
      pageNumber: pageNumber,
      pageSize: pageSize,
    });
  }

  public setFilter(filter: CadmusModelFilter): void {
    this._store.update({
      project: filter.project,
      typeId: filter.typeId,
      name: filter.name,
      tags: filter.tags,
      matchAny: filter.matchAny,
    });
  }
}
