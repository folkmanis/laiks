import { TestBed } from '@angular/core/testing';

import { ApplianceResolverService } from './appliance-resolver.service';

describe('ApplianceResolverService', () => {
  let service: ApplianceResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApplianceResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
