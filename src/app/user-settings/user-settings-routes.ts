import { Route } from '@angular/router';
import {
  UserSettingsComponent,
  UserAppliancesComponent,
  EditUserApplianceComponent,
  resolveActiveUserId,
  resolveActiveUser,
  canMatchNpUser,
} from '@shared/users';
import { canDeactivateGuard } from '@shared/utils';

// /
// /appliances
// /appliances/new
// /appliances/:idx

export default [
  {
    path: '',
    pathMatch: 'full',
    component: UserSettingsComponent,
    resolve: {
      id: resolveActiveUserId,
      user: resolveActiveUser,
    },
    canDeactivate: [canDeactivateGuard],
  },
  {
    path: 'appliances',
    canMatch: [canMatchNpUser],
    resolve: {
      id: resolveActiveUserId,
    },
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: UserAppliancesComponent,
      },
      {
        path: 'new',
        component: EditUserApplianceComponent,
        canDeactivate: [canDeactivateGuard],
        data: {
          idx: null,
        },
      },
      {
        path: ':idx',
        component: EditUserApplianceComponent,
        canDeactivate: [canDeactivateGuard],
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
] as Route[];
