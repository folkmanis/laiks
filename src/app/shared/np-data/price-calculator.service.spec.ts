import { TestBed } from '@angular/core/testing';

import { provideExperimentalZonelessChangeDetection } from '@angular/core';
import { addHours, addMinutes } from 'date-fns';
import { PowerAppliance } from '../appliances';
import { NpPrice } from './np-price.interface';
import { PriceCalculatorService } from './price-calculator.service';

export const pricesStart = new Date(2022, 0, 1, 12, 0, 0);

export const testPrices: NpPrice[] = [
  {
    startTime: pricesStart,
    endTime: addHours(pricesStart, 1),
    value: 20.0,
  },
  {
    startTime: addHours(pricesStart, 1),
    endTime: addHours(pricesStart, 2),
    value: 10.0,
  },
  {
    startTime: addHours(pricesStart, 2),
    endTime: addHours(pricesStart, 3),
    value: 5.0,
  },
  {
    startTime: addHours(pricesStart, 3),
    endTime: addHours(pricesStart, 4),
    value: 2.0,
  },
  {
    startTime: addHours(pricesStart, 4),
    endTime: addHours(pricesStart, 5),
    value: 1.5,
  },
];

export const dishWasher: PowerAppliance = {
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
  name: 'Trauku mašīna',
  delay: 'start',
  minimumDelay: 0, // hours
  enabled: true,
  color: '#ff00ff',
};

export const washer: PowerAppliance = {
  ...dishWasher,
  delay: 'end',
  minimumDelay: 3,
  name: 'Veļasmašīna',
};

const dishWasherCosts = [
  19.5,
  9.75,
  17070000 / 1000.0 / 60.0 / 60.0, // Ws to kWh
  7500000 / 1000.0 / 60.0 / 60.0, // Ws to kWh
];
const washerCosts = [
  19140000 / 1000.0 / 60.0 / 60.0, // Ws to kWh
  7845000 / 1000.0 / 60.0 / 60.0, // Ws to kWh
];

const after30min = addMinutes(pricesStart, 30);
const after4h = addHours(pricesStart, 4);

describe('PriceCalculatorService', () => {
  let service: PriceCalculatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideExperimentalZonelessChangeDetection()],
    });
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
    const cost = service.cycleConsumption(
      dishWasher.cycles[0],
      testPrices,
      +after30min,
    );
    const expected = 600000 * 1000;
    expect(cost).toBeCloseTo(expected, 3);
  });

  it('should calculate cycle price', () => {
    const cost = service.priceTime(testPrices, after30min, dishWasher);
    const expected = 19.5;
    expect(cost).toBeCloseTo(expected, 2);
  });

  it('should calculate dishwasher costs', () => {
    const costs = service.allOffsetCosts(testPrices, after30min, dishWasher);
    expect(costs.get(0)).toBeCloseTo(dishWasherCosts[0], 3);
    expect(costs.get(1)).toBeCloseTo(dishWasherCosts[1], 3);
    expect(costs.get(2)).toBeCloseTo(dishWasherCosts[2], 3);
    expect(costs.get(3)).toBeCloseTo(dishWasherCosts[3], 3);
  });

  it('should calculate dishwasher best offset', () => {
    const costs = service.allOffsetCosts(testPrices, after30min, dishWasher);
    const { offset } = service.bestOffset(costs)!;
    expect(offset).toBe(3);
  });

  it('should NOT calculate dishwasher best offset', () => {
    const costs = service.allOffsetCosts(testPrices, after4h, dishWasher);
    expect(costs.size).toBe(0);
    expect(service.bestOffset(costs)).toBeNull();
  });

  it('should calculate washer costs', () => {
    const costs = service.allOffsetCosts(testPrices, after30min, washer);
    expect(costs.get(3)).toBeCloseTo(washerCosts[0], 3);
    expect(costs.get(4)).toBeCloseTo(washerCosts[1], 3);
    const { offset } = service.bestOffset(costs)!;
    expect(offset).toBe(4);
  });

  it('should create vat enabled function', () => {
    const vatFn = service.getVatFn({
      includeVat: true,
      vatAmount: 0.21,
    });
    expect(vatFn(100)).toBe(121);
  });

  it('should create vat disabled function', () => {
    const vatFn = service.getVatFn({
      includeVat: false,
      vatAmount: 0.21,
    });
    expect(vatFn(100)).toBe(100);
  });

  it('should create vat unset function', () => {
    const vatFn = service.getVatFn({
      includeVat: true,
      vatAmount: undefined as unknown as number,
    });
    expect(vatFn(100)).toBe(100);
  });

  it('should create vat not enabled function', () => {
    const vatFn = service.getVatFn({
      includeVat: null as unknown as boolean,
      vatAmount: 0.21,
    });
    expect(vatFn(100)).toBe(100);
  });

  it('should create extra costs enabled function', () => {
    const extraFn = service.getExtraCostsFn({
      fixedComponentEnabled: true,
      fixedComponentKwh: 0.01,
      tradeMarkupEnabled: true,
      tradeMarkupKwh: 0.01,
    });
    expect(extraFn(100)).toBe(120);
  });

  it('should create extra costs not enabled function', () => {
    const extraFn = service.getExtraCostsFn({
      fixedComponentEnabled: false,
      fixedComponentKwh: 0.01,
      tradeMarkupEnabled: false,
      tradeMarkupKwh: 0.01,
    });
    expect(extraFn(100)).toBe(100);
  });

  it('should create extra costs unset function', () => {
    const extraFn = service.getExtraCostsFn({
      fixedComponentEnabled: true,
      fixedComponentKwh: undefined as unknown as number,
      tradeMarkupEnabled: true,
      tradeMarkupKwh: undefined as unknown as number,
    });
    expect(extraFn(100)).toBe(100);
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
