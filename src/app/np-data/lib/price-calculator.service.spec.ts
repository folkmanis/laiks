import { TestBed } from '@angular/core/testing';

import { PriceCalculatorService } from './price-calculator.service';
import { NpPrice } from './np-price.interface';
import { PowerAppliance } from './power-appliance.interface';
import { addHours, addMinutes } from 'date-fns';

const pricesStart = new Date(2022, 0, 1, 12, 0, 0);

const testPrices: NpPrice[] = [
  {
    startTime: pricesStart,
    endTime: addHours(pricesStart, 1),
    value: 20.0,
  }, {
    startTime: addHours(pricesStart, 1),
    endTime: addHours(pricesStart, 2),
    value: 10.0,
  }, {
    startTime: addHours(pricesStart, 2),
    endTime: addHours(pricesStart, 3),
    value: 5.0,
  }, {
    startTime: addHours(pricesStart, 3),
    endTime: addHours(pricesStart, 4),
    value: 2.0,
  }, {
    startTime: addHours(pricesStart, 4),
    endTime: addHours(pricesStart, 5),
    value: 1.5,
  },
];

const dishWasher: PowerAppliance = {
  cycles: [
    {
      consumption: 100,
      length: 5 * 60 * 1000, // 5 min
    },
    {
      consumption: 2000,
      length: 30 * 60 * 1000, // 30 min
    },
    {
      consumption: 150,
      length: 40 * 60 * 1000, // 40 min
    },
  ],
  name: "Trauku mašīna",
  delay: "start",
  minimumDelay: 0, // hours
  enabled: true,
  color: "#ff00ff",
};

const washer: PowerAppliance = {
  ...dishWasher,
  delay: "end",
  minimumDelay: 3,
  name: "Veļasmašīna"

};

const after30min = addMinutes(pricesStart, 30);
const after4h = addHours(pricesStart, 4);


describe('PriceCalculatorService', () => {
  let service: PriceCalculatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PriceCalculatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should calculate cycle length', () => {
    const total = service.cycleLength(dishWasher.cycles);
    expect(total).toBe((5 + 30 + 40) * 60 * 1000); // 5 + 30 + 40 min
  });

  it('should calculate one cycle consumption', () => {
    const cost = service.cycleConsumption(dishWasher.cycles[0], testPrices, +after30min);
    const expected = 600000 * 1000;
    expect(cost).toBeCloseTo(expected, 3);
  });

  it('should calculate cycle price', () => {
    const cost = service.priceTime(testPrices, after30min, dishWasher);
    const expected = 0.0195;
    expect(cost).toBeCloseTo(expected, 2);
  });

  /*   
  it('should NOT calculate best offset', () => {
    const testTime = new Date(1.5 * 60 * 60 * 1000); // start time
    expect(service.bestOffset([], testTime, washer)).toBeNull();
  });

  it('should calculate best offset', () => {
    const testTime = new Date(1.5 * 60 * 60 * 1000 + 80 * 60 * 1000); // cycle end for washer
    expect(service.bestOffset(testPrices, testTime, washer)?.offset).toEqual(2);
    expect(service.bestOffset(testPrices, testTime, washer)?.price).toBeCloseTo(0.126, 3);
  });

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
