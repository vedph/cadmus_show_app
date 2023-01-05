import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { CadmusShopAssetService } from '@myrmidon/cadmus-shop-asset';
import { CadmusModel, CadmusModelFilter } from '@myrmidon/cadmus-shop-core';

import { PaginationData } from '@ngneat/elf-pagination';

import { ModelListRepository } from './model-list.repository';
import { StatusState } from '@ngneat/elf-requests';

@Component({
  selector: 'cadmus-model-list',
  templateUrl: './model-list.component.html',
  styleUrls: ['./model-list.component.scss'],
})
export class ModelListComponent implements OnInit {
  public pagination$: Observable<PaginationData & { data: CadmusModel[] }>;
  public filter$: Observable<CadmusModelFilter | undefined>;
  public loading$: Observable<boolean>;
  public model: CadmusModel | undefined;

  constructor(
    private _assetService: CadmusShopAssetService,
    // services related to the filter store
    private _repository: ModelListRepository
  ) {
    this.pagination$ = _repository.pagination$;
    this.loading$ = _repository.loading$;
    this.filter$ = _repository.filter$;
  }

  public pageChange(event: PageEvent): void {
    this._repository.loadPage(event.pageIndex + 1, event.pageSize);
  }

  public clearCache(): void {
    this._repository.clearCache();
    this._repository.loadPage(1);
  }

  ngOnInit(): void {}

  public onViewModel(model: CadmusModel): void {
    this._assetService
      .getModelDetails(model)
      .pipe(take(1))
      .subscribe((m) => {
        this.model = m;
      });
  }
}
