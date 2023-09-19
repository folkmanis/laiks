import { Timestamp } from '@angular/fire/firestore';

export interface NpPrice {
  startTime: Date;
  endTime: Date;
  value: number;
}

export type NpPriceWithOffset = NpPrice & {
  dateNow: Date;
  difference: number;
};
export interface NpData {
  lastUpdate: Date;
  average: number;
  averageDays: number;
  stDev: number;
}

export interface NpPriceCollectionData {
  startTime: Timestamp;
  endTime: Timestamp;
  value: number;
}
