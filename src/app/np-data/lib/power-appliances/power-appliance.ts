import { PowerConsumptionCycle } from './power-consumption-cycle';

export interface PowerAppliance {
    delay: 'start' | 'end';
    cycles: PowerConsumptionCycle[];
    minimumDelay: number; // hours
}
