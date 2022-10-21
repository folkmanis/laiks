import { TestBed } from '@angular/core/testing';

import { LaiksService } from './laiks.service';

describe('LaiksService', () => {
  let service: LaiksService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LaiksService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
