import { TestBed } from '@angular/core/testing';

import { UserAppliancesService } from './user-appliances.service';

describe('UserAppliancesService', () => {
  let service: UserAppliancesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserAppliancesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
