import { PowerAppliance } from './power-appliance';
import { PowerConsumptionCycle } from './power-consumption-cycle';

const washerConsumption: PowerConsumptionCycle[] = [
    {
        length: 5 * 60 * 1000,
        consumption: 100,
    },
    {
        length: 30 * 60 * 1000,
        consumption: 2000,
    },
    {
        length: 45 * 60 * 1000,
        consumption: 150,
    },
];

export const washer: PowerAppliance = {
    delay: 'end',
    cycles: washerConsumption,
    minimumDelay: 2,
}

