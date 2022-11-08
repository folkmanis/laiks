import { PowerConsumptionCycle } from './power-consumption-cycle';
import { PowerAppliance } from './power-appliance';

const cycles: PowerConsumptionCycle[] = [
    {
        length: 25 * 60 * 1000, // 25 min
        consumption: 100,
    },
    {
        length: 90 * 60 * 1000, // 1,5 h
        consumption: 1000,
    },
    {
        length: 15 * 60 * 1000,
        consumption: 100,
    },
    {
        length: 25 * 60 * 1000,
        consumption: 1000,
    },
    {
        length: 25 * 60 * 1000,
        consumption: 50,
    }

];

export const dishwasher: PowerAppliance = {
    delay: 'start',
    minimumDelay: 0,
    cycles
};