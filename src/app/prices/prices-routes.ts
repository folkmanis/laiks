import { Route } from '@angular/router';
import { SystemPricesComponent } from './system-prices/system-prices.component';
import { ApplianceCostsComponent } from './appliance-costs/appliance-costs.component';
import { resolveUserAppliance } from './appliance-costs/resolve-user-appliance';
import { userApplianceGuard } from './appliance-costs/user-appliance.guard';

export default [
  {
    path: 'system',
    component: SystemPricesComponent,
  },
  {
    path: 'appliance/:idx',
    component: ApplianceCostsComponent,
    canActivate: [userApplianceGuard],
    resolve: {
      appliance: resolveUserAppliance,
    },
  },
  {
    path: '**',
    redirectTo: 'system',
  },
] as Route[];
