import { TestBed } from '@angular/core/testing';

import { ProfileUtilService } from './profile-util.service';

describe('ProfileUtilService', () => {
  let service: ProfileUtilService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProfileUtilService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
