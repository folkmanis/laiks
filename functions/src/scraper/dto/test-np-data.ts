import { readFileSync } from 'fs';
import { NpPrice } from './np-price';

export const TEST_JSON_DATA = readFileSync(
  './src/scraper/dto/test-np-data-v2.json',
  'utf-8',
);

export const TEST_AVERAGE = 88.64875;
export const TEST_STDEV = 100.1632088;

export const TEST_OBJ: NpPrice[] = [
  {
    startTime: new Date('2024-10-15T22:00:00Z'),
    endTime: new Date('2024-10-15T23:00:00Z'),
    value: 30.48,
  },
  {
    startTime: new Date('2024-10-15T23:00:00Z'),
    endTime: new Date('2024-10-16T00:00:00Z'),
    value: 12.8,
  },
  {
    startTime: new Date('2024-10-16T00:00:00Z'),
    endTime: new Date('2024-10-16T01:00:00Z'),
    value: 5.3,
  },
  {
    startTime: new Date('2024-10-16T01:00:00Z'),
    endTime: new Date('2024-10-16T02:00:00Z'),
    value: 3.61,
  },
  {
    startTime: new Date('2024-10-16T02:00:00Z'),
    endTime: new Date('2024-10-16T03:00:00Z'),
    value: 4.04,
  },
  {
    startTime: new Date('2024-10-16T03:00:00Z'),
    endTime: new Date('2024-10-16T04:00:00Z'),
    value: 104.95,
  },
  {
    startTime: new Date('2024-10-16T04:00:00Z'),
    endTime: new Date('2024-10-16T05:00:00Z'),
    value: 194.79,
  },
  {
    startTime: new Date('2024-10-16T05:00:00Z'),
    endTime: new Date('2024-10-16T06:00:00Z'),
    value: 300.07,
  },
  {
    startTime: new Date('2024-10-16T06:00:00Z'),
    endTime: new Date('2024-10-16T07:00:00Z'),
    value: 186.94,
  },
  {
    startTime: new Date('2024-10-16T07:00:00Z'),
    endTime: new Date('2024-10-16T08:00:00Z'),
    value: 79.96,
  },
  {
    startTime: new Date('2024-10-16T08:00:00Z'),
    endTime: new Date('2024-10-16T09:00:00Z'),
    value: 26.68,
  },
  {
    startTime: new Date('2024-10-16T09:00:00Z'),
    endTime: new Date('2024-10-16T10:00:00Z'),
    value: 14.16,
  },
  {
    startTime: new Date('2024-10-16T10:00:00Z'),
    endTime: new Date('2024-10-16T11:00:00Z'),
    value: 4.99,
  },
  {
    startTime: new Date('2024-10-16T11:00:00Z'),
    endTime: new Date('2024-10-16T12:00:00Z'),
    value: 5.99,
  },
  {
    startTime: new Date('2024-10-16T12:00:00Z'),
    endTime: new Date('2024-10-16T13:00:00Z'),
    value: 8.71,
  },
  {
    startTime: new Date('2024-10-16T13:00:00Z'),
    endTime: new Date('2024-10-16T14:00:00Z'),
    value: 27.02,
  },
  {
    startTime: new Date('2024-10-16T14:00:00Z'),
    endTime: new Date('2024-10-16T15:00:00Z'),
    value: 110.19,
  },
  {
    startTime: new Date('2024-10-16T15:00:00Z'),
    endTime: new Date('2024-10-16T16:00:00Z'),
    value: 300.01,
  },
  {
    startTime: new Date('2024-10-16T16:00:00Z'),
    endTime: new Date('2024-10-16T17:00:00Z'),
    value: 300.02,
  },
  {
    startTime: new Date('2024-10-16T17:00:00Z'),
    endTime: new Date('2024-10-16T18:00:00Z'),
    value: 195.43,
  },
  {
    startTime: new Date('2024-10-16T18:00:00Z'),
    endTime: new Date('2024-10-16T19:00:00Z'),
    value: 103.42,
  },
  {
    startTime: new Date('2024-10-16T19:00:00Z'),
    endTime: new Date('2024-10-16T20:00:00Z'),
    value: 63.89,
  },
  {
    startTime: new Date('2024-10-16T20:00:00Z'),
    endTime: new Date('2024-10-16T21:00:00Z'),
    value: 25.03,
  },
  {
    startTime: new Date('2024-10-16T21:00:00Z'),
    endTime: new Date('2024-10-16T22:00:00Z'),
    value: 19.09,
  },
];
