import { MarketZone } from './dto/market-zone';

export const DEFAULT_MARKET_ZONES: [string, MarketZone][] = [
  [
    'LV',
    {
      dbName: 'np-data',
      description: 'Latvija',
      url: 'https://www.nordpoolgroup.com/api/marketdata/page/59?currency=,EUR,EUR,EUR',
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
      url: 'https://www.nordpoolgroup.com/api/marketdata/page/29?currency=,EUR,EUR,EUR&entityName=SE1',
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
      url: 'https://www.nordpoolgroup.com/api/marketdata/page/53?currency=,,EUR,EUR',
      locale: 'lt',
      tax: 0.21,
      enabled: false,
    },
  ],
];
