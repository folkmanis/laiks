import { TestBed } from '@angular/core/testing';

import { ApplianceGuard } from './appliance.guard';

describe('ApplianceGuard', () => {
  let guard: ApplianceGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ApplianceGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
