export interface PowerConsumptionCycle {
  length: number; // milliseconds
  consumption: number; // watts
}

export interface PowerAppliance {
  delay: 'start' | 'end';
  cycles: PowerConsumptionCycle[];
  minimumDelay: number; // hours
  name: string;
  enabled: boolean;
  color: string | null;
}

export type PresetPowerAppliance = PowerAppliance & {
  localizedNames: { [key: string]: string };
};

export type PowerApplianceWithHourlyCosts = PowerAppliance & {
  costs: Map<number, number>;
  bestOffset?: number;
};
