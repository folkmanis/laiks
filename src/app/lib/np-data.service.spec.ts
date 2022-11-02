import { TestBed } from '@angular/core/testing';

import { NpDataService } from './np-data.service';

describe('NpDataService', () => {
  let service: NpDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NpDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
