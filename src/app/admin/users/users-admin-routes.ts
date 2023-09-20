import { Route } from '@angular/router';
import { UserEditComponent } from './user-edit/user-edit.component';
import { UsersListComponent } from './users-list/users-list.component';
import {
  EditUserApplianceComponent,
  UserAppliancesComponent,
  UserSettingsComponent,
  resolveActiveUserId,
  resolveUser,
} from '@shared/users';
import { canDeactivateGuard } from '@shared/utils';

// :id
// :id/permissions
// :id/appliances
// :id/appliances/new
// :id/appliances/:idx

export default [
  {
    path: ':id',
    resolve: {
      user: resolveUser,
    },
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: UserSettingsComponent,
        canDeactivate: [canDeactivateGuard],
      },
      {
        path: 'permissions',
        component: UserEditComponent,
        resolve: {
          activeUserId: resolveActiveUserId,
        },
        canDeactivate: [canDeactivateGuard],
      },
      {
        path: 'appliances',
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
    ],
  },
  {
    path: '',
    component: UsersListComponent,
    pathMatch: 'full',
    resolve: {
      activeUserId: resolveActiveUserId,
    },
  },
  {
    path: '**',
    redirectTo: '/',
  },
] as Route[];
