import { Route } from '@angular/router';
import { MarketZonesListComponent } from './market-zones-list/market-zones-list.component';
import { MarketZoneEditComponent } from './market-zone-edit/market-zone-edit.component';
import { resolveMarketZone } from './market-zone-resolver';
import { canDeactivateGuard } from 'src/app/shared/utils/can-deactivate.guard';

export default [
  {
    path: '',
    pathMatch: 'full',
    component: MarketZonesListComponent,
  },
  {
    path: 'new',
    component: MarketZoneEditComponent,
    canDeactivate: [canDeactivateGuard],
  },
  {
    path: ':id',
    component: MarketZoneEditComponent,
    canDeactivate: [canDeactivateGuard],
    resolve: {
      initialValue: resolveMarketZone,
    },
  },
  {
    path: '**',
    redirectTo: '',
  },
] as Route[];
