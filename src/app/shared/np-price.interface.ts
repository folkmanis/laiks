import { Timestamp } from '@angular/fire/firestore';

export interface NpPrice {
    startTime: Date,
    endTime: Date,
    value: number,
}

export type NpPriceOffset = NpPrice & {
    dateNow: Date,
    difference: number,
};
export interface NpData {
    prices: NpPrice[],
    lastUpdate: Date,
    average: number,
    averageDays: number,
    stDev: number,
}

export interface NpPriceCollectionData {
    startTime: Timestamp,
    endTime: Timestamp,
    value: number,
}
