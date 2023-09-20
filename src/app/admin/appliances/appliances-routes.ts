import { Route } from '@angular/router';
import { resolveSystemAppliance } from '@shared/appliances';
import { canDeactivateGuard } from '@shared/utils';
import { AppliancesListComponent } from './appliances-list/appliances-list.component';
import { EditSystemAppliancesComponent } from './edit-system-appliances/edit-system-appliances.component';

export default [
  {
    path: 'new',
    component: EditSystemAppliancesComponent,
    data: {
      appliance: null,
      id: null,
    },
    canDeactivate: [canDeactivateGuard],
  },
  {
    path: ':id',
    component: EditSystemAppliancesComponent,
    resolve: {
      appliance: resolveSystemAppliance,
    },
    canDeactivate: [canDeactivateGuard],
  },
  {
    path: '',
    pathMatch: 'full',
    component: AppliancesListComponent,
  },
] as Route[];
