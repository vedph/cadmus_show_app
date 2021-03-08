import { TestBed } from '@angular/core/testing';

import { ThesaurusNodesService } from './thesaurus-nodes.service';

describe('ThesaurusNodesService', () => {
  let service: ThesaurusNodesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThesaurusNodesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
