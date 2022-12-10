
export interface PowerConsumptionCycle {
    length: number, // milliseconds
    consumption: number, // watts
}

export interface PowerAppliance {
    delay: 'start' | 'end';
    cycles: PowerConsumptionCycle[];
    minimumDelay: number; // hours
    name: string;
    enabled: boolean;
    color: string | null;
}

export type PowerApplianceWithBestOffset = PowerAppliance & {
    bestOffset: { offset: number, price: number; } | null;
}

