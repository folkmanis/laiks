import { Timestamp } from '@angular/fire/firestore';

export interface NpPrice {
    startTime: Date,
    endTime: Date,
    value: number,
}

export type NpPriceOffset = NpPrice & {
    difference: number,
};
export interface NpData {
    prices: NpPrice[],
    lastUpdate: Date,
}

export interface NpPriceCollectionData {
    startTime: Timestamp,
    endTime: Timestamp,
    value: number,
}

export interface StoredNpData {
    prices: {
        startTime: string,
        endTime: string,
        value: number,
    }[],
    lastUpdate: string,
}
