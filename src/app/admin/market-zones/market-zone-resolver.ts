import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { MarketZone, MarketZonesService } from '@shared';
import { first } from 'rxjs';

export const resolveMarketZone: ResolveFn<MarketZone> = (route) =>
  inject(MarketZonesService)
    .getZoneFlow(route.paramMap.get('id')!)
    .pipe(first());
