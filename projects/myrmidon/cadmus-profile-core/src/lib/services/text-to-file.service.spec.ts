import { TestBed } from '@angular/core/testing';

import { TextToFileService } from './text-to-file.service';

describe('TextToFileService', () => {
  let service: TextToFileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TextToFileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
