import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { MarketZone, MarketZonesService } from '@shared/np-data';

export const resolveMarketZone: ResolveFn<MarketZone> = (route) =>
  inject(MarketZonesService).getZone(route.paramMap.get('id')!);
