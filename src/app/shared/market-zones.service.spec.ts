import { TestBed } from '@angular/core/testing';

import { MarketZonesService } from './market-zones.service';

describe('MarketZonesService', () => {
  let service: MarketZonesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MarketZonesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
