import { Route } from '@angular/router';
import {
  DeleteUserComponent,
  EditUserApplianceComponent,
  UserAppliancesComponent,
  UserSettingsComponent,
  resolveActiveUserId,
  resolveUser,
} from '@shared/users';
import { canDeactivateGuard } from '@shared/utils';
import { UserEditComponent } from './user-edit/user-edit.component';
import { UsersListComponent } from './users-list/users-list.component';

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
        path: 'settings',
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
      {
        path: 'delete-user',
        component: DeleteUserComponent,
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
