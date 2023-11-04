import { Component } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { CadmusShopAssetService } from '@myrmidon/cadmus-shop-asset';
import { CadmusModel, DataPage } from '@myrmidon/cadmus-shop-core';

import { ModelListRepository } from './model-list.repository';

@Component({
  selector: 'cadmus-model-list',
  templateUrl: './model-list.component.html',
  styleUrls: ['./model-list.component.scss'],
})
export class ModelListComponent {
  public page$: Observable<DataPage<CadmusModel>>;
  public loading$: Observable<boolean>;
  public model: CadmusModel | undefined;

  constructor(
    private _assetService: CadmusShopAssetService,
    // services related to the filter store
    private _repository: ModelListRepository
  ) {
    this.page$ = _repository.page$;
    this.loading$ = _repository.loading$;
  }

  public onPageChange(event: PageEvent): void {
    this._repository.setPage(event.pageIndex + 1, event.pageSize);
  }

  public reset(): void {
    this._repository.reset();
  }

  public onViewModel(model: CadmusModel): void {
    this._assetService
      .getModelDetails(model)
      .pipe(take(1))
      .subscribe((m) => {
        this.model = m;
      });
  }
}
