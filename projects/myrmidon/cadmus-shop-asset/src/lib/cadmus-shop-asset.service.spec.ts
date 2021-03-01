import { TestBed } from '@angular/core/testing';

import { CadmusShopAssetService } from './cadmus-shop-asset.service';

describe('CadmusShopAssetService', () => {
  let service: CadmusShopAssetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CadmusShopAssetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
