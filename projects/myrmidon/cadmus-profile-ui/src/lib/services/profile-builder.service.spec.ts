import { TestBed } from '@angular/core/testing';

import { ProfileBuilderService } from './profile-builder.service';

describe('ProfileBuilderService', () => {
  let service: ProfileBuilderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProfileBuilderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
