export enum ApplianceType {
    SYSTEM,
    USER,
}

export interface ApplianceRecord {
    type: ApplianceType;
    applianceId: string;
}

export interface LaiksUser {
    email: string;
    verified: boolean;
    name: string;
    appliances: ApplianceRecord[];
    pricesWithTax: boolean;
}

export const defaultUser = (
    email: string,
    name: string,
): LaiksUser => ({
    email,
    name,
    verified: false,
    pricesWithTax: true,
    appliances: [
        {
            type: ApplianceType.SYSTEM,
            applianceId: 'dishwasher',
        },
        {
            type: ApplianceType.SYSTEM,
            applianceId: 'washer',
        }
    ],
});
