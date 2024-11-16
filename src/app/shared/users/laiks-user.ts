import { PowerAppliance } from '../appliances/power-appliance.interface';

export interface LaiksUser {
  email: string;
  name: string;
  verified: boolean;
  appliances: PowerAppliance[];
  marketZoneId: string;
  includeVat: boolean;
  vatAmount: number;
  locale: string;
  fixedComponentEnabled: boolean;
  fixedComponentKwh: number;
  tradeMarkupEnabled: boolean;
  tradeMarkupKwh: number;
}

export const defaultUser = (email: string, name: string): LaiksUser => ({
  email,
  name,
  verified: false,
  marketZoneId: 'LV',
  appliances: [],
  includeVat: true,
  vatAmount: 0.21,
  locale: 'lv',
  fixedComponentEnabled: false,
  fixedComponentKwh: 0,
  tradeMarkupEnabled: false,
  tradeMarkupKwh: 0,
});
