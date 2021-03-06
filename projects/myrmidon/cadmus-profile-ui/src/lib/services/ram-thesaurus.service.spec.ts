import { TestBed } from '@angular/core/testing';

import { RamThesaurusService } from './ram-thesaurus.service';

describe('RamThesaurusService', () => {
  let service: RamThesaurusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RamThesaurusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
