import { TestBed } from '@angular/core/testing';

import { NpUserGuard } from './np-user.guard';

describe('NpUserGuard', () => {
  let guard: NpUserGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(NpUserGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
