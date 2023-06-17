import { PowerAppliance } from 'src/app/shared/power-appliance.interface';
import { WithId } from 'src/app/shared/with-id';

export interface ApplianceDialogData {
    system: WithId<PowerAppliance>[];
    user: WithId<PowerAppliance>[];
}

export type ApplianceResponseType = 'system' | 'user' | 'new';

export interface ApplianceResponseSystem {
    type: 'system';
    applianceId: string;
}

export interface ApplianceResponseUser {
    type: 'user';
    applianceId: string;
}

export interface ApplianceResponseNew {
    type: 'new';
}

export type ApplianceResponse = ApplianceResponseSystem | ApplianceResponseUser | ApplianceResponseNew;