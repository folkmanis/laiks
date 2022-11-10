
export interface PowerConsumptionCycle {
    length: number, // milliseconds
    consumption: number, // watts
}

export interface PowerAppliance {
    delay: 'start' | 'end';
    cycles: PowerConsumptionCycle[];
    minimumDelay: number; // hours
    name: string;
}

