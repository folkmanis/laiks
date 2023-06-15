import { TestBed } from '@angular/core/testing';

import { PermissionsAdminService } from './permissions-admin.service';

describe('PermissionsAdminService', () => {
  let service: PermissionsAdminService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PermissionsAdminService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
