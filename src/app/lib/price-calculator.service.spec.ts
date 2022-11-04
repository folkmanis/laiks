import { TestBed } from '@angular/core/testing';

import { PriceCalculatorService } from './price-calculator.service';
import { NpPrice } from './np-data.service';

const testPrices: NpPrice[] = [
  {
    startTime: new Date(1 * 60 * 60 * 1000), // 1-st hour
    endTime: new Date(2 * 60 * 60 * 1000),
    value: 100,
  },
  {
    startTime: new Date(2 * 60 * 60 * 1000),
    endTime: new Date(3 * 60 * 60 * 1000),
    value: 150,
  },
  {
    startTime: new Date(3 * 60 * 60 * 1000),
    endTime: new Date(4 * 60 * 60 * 1000),
    value: 200,
  }
];




describe('PriceCalculatorService', () => {
  let service: PriceCalculatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PriceCalculatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should calculate consumption', () => {
    const testTime = new Date(1.5 * 60 * 60 * 1000);
    expect(service.priceTime(testPrices, testTime)).toBeCloseTo(0.126, 3);
  });
});
