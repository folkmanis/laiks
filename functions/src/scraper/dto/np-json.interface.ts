export interface NpJson<C extends string = string> {
  deliveryDateCET: string;
  version: number;
  updatedAt: string;
  deliveryAreas: C[];
  market: string;
  multiAreaEntries: MultiAreaEntry<C>[];
  blockPriceAggregates: BlockPriceAggregate<C>[];
  currency: string;
  exchangeRate: number;
  areaStates: AreaState<C>[];
  areaAverages: AreaAverage<C>[];
}

export interface MultiAreaEntry<C extends string> {
  deliveryStart: string;
  deliveryEnd: string;
  entryPerArea: Record<C, number>;
}

export interface BlockPriceAggregate<C extends string> {
  blockName: 'Off-peak 1' | 'Peak' | 'Off-peak 2';
  deliveryStart: string;
  deliveryEnd: string;
  averagePricePerArea: Record<C, AveragePricePerArea>;
}

export interface AveragePricePerArea {
  average: number;
  min: number;
  max: number;
}

export interface AreaState<C extends string> {
  state: 'Final';
  areas: C[];
}

export interface AreaAverage<C extends string> {
  areaCode: C;
  price: number;
}
