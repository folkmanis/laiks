import { MarketZone } from './dto/market-zone';

export const DEFAULT_MARKET_ZONES: [string, MarketZone][] = [
  [
    'LV',
    {
      dbName: 'np-data',
      description: 'Latvija',
      locale: 'lv',
      tax: 0.21,
      enabled: true,
    },
  ],
  [
    'SE1',
    {
      dbName: 'SE1',
      description: 'Luleå',
      locale: 'se',
      tax: 0.25,
      enabled: true,
    },
  ],
  [
    'LT',
    {
      dbName: 'LT',
      description: 'Lietuva',
      locale: 'lt',
      tax: 0.21,
      enabled: false,
    },
  ],
];
