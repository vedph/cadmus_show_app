import { TestBed } from '@angular/core/testing';

import { PartDefinitionVmService } from './part-definition-vm.service';

describe('PartDefinitionVmService', () => {
  let service: PartDefinitionVmService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PartDefinitionVmService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
