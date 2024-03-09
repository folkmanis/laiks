import { Route } from '@angular/router';
import { INITIAL_APPLIANCE, resolveSystemAppliance } from '@shared/appliances';
import { canDeactivateGuard } from '@shared/utils';
import { AppliancesListComponent } from './appliances-list/appliances-list.component';
import { EditSystemAppliancesComponent } from './edit-system-appliances/edit-system-appliances.component';
import { LocalizedNamesComponent } from './localized-names/localized-names.component';
import { resolveLocales } from '@shared/locales';

export default [
  {
    path: 'new',
    component: EditSystemAppliancesComponent,
    data: {
      appliance: INITIAL_APPLIANCE,
      id: null,
    },
    canDeactivate: [canDeactivateGuard],
  },
  {
    path: ':id',
    resolve: {
      appliance: resolveSystemAppliance,
    },
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: EditSystemAppliancesComponent,
        canDeactivate: [canDeactivateGuard],
      },
      {
        path: 'localized-names',
        component: LocalizedNamesComponent,
        canDeactivate: [canDeactivateGuard],
        resolve: {
          locales: resolveLocales,
        },
      },
    ],
  },
  {
    path: '',
    pathMatch: 'full',
    component: AppliancesListComponent,
  },
] as Route[];
