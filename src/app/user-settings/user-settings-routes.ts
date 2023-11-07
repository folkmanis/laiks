import { Route } from '@angular/router';
import {
  DeleteUserComponent,
  EditUserApplianceComponent,
  UserAppliancesComponent,
  UserSettingsComponent,
  npUserGuard,
  resolveActiveUser,
  resolveActiveUserId,
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
    canMatch: [npUserGuard],
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
    path: 'delete-user',
    component: DeleteUserComponent,
    resolve: {
      id: resolveActiveUserId,
      user: resolveActiveUser,
    },
  },
  {
    path: '**',
    redirectTo: '',
  },
] as Route[];
