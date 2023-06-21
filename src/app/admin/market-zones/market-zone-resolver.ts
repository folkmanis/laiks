import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { first } from 'rxjs';
import { MarketZone } from 'src/app/shared/market-zone';
import { MarketZonesService } from 'src/app/shared/market-zones.service';

export const resolveMarketZone: ResolveFn<MarketZone> =
    (route) => inject(MarketZonesService)
        .getZoneFlow(route.paramMap.get('id')!)
        .pipe(first());
