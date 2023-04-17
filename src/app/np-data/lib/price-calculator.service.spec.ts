import { TestBed } from '@angular/core/testing';

import { PriceCalculatorService } from './price-calculator.service';
import { NpPrice } from './np-price.interface';
import { PowerAppliance } from './power-appliance.interface';

const testPrices: NpPrice[] = [
  {
    startTime: new Date(1 * 60 * 60 * 1000),
    endTime: new Date(2 * 60 * 60 * 1000),
    value: 200,
  },
  {
    startTime: new Date(2 * 60 * 60 * 1000),
    endTime: new Date(3 * 60 * 60 * 1000),
    value: 100,
  },
  {
    startTime: new Date(3 * 60 * 60 * 1000),
    endTime: new Date(4 * 60 * 60 * 1000),
    value: 150,
  },
];

const washer: PowerAppliance = {
  delay: 'start',
  cycles: [
    {
      consumption: 100,
      length: 300000
    },
  ],
  minimumDelay: 3, // hours
  name: "Veļasmašīna",
  enabled: true,
  color: "#ff00ff",

};




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
    const testTime = new Date(2.5 * 60 * 60 * 1000 + 80 * 60 * 1000); // cycle end for washer
    expect(service.priceTime(testPrices, testTime, washer)).toBeCloseTo(0.126, 3);
  });

  it('should NOT calculate best offset', () => {
    const testTime = new Date(1.5 * 60 * 60 * 1000); // start time
    expect(service.bestOffset([], testTime, washer)).toBeNull();
  });

  it('should calculate best offset', () => {
    const testTime = new Date(1.5 * 60 * 60 * 1000 + 80 * 60 * 1000); // cycle end for washer
    expect(service.bestOffset(testPrices, testTime, washer)?.offset).toEqual(2);
    expect(service.bestOffset(testPrices, testTime, washer)?.price).toBeCloseTo(0.126, 3);
  });

  /*   
    it('should calculate best offset', () => {
      const testTime = new Date(2 * 60 * 60 * 1000);
      expect(service.bestOffset(testPrices, testTime, washer)?.offset).toEqual(2);
      expect(service.bestOffset(testPrices, testTime, washer)?.price).toBeCloseTo(0.1427, 3);
    });
  
    it('should calculate best offset', () => {
      const testTime = new Date(0);
      expect(service.bestOffset(testPrices, testTime, washer)?.offset).toEqual(4);
      expect(service.bestOffset(testPrices, testTime, washer)?.price).toBeCloseTo(0.1427, 3);
    });
  
    it('should calculate best offset', () => {
      const testTime = new Date(4.1 * 60 * 60 * 1000);
      expect(service.bestOffset(testPrices, testTime, washer)).toBeNull();
    });
   */
});
