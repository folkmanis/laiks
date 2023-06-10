import { Route } from '@angular/router';
import { canDeactivateGuard } from '../shared/can-deactivate.guard';
import { ApplianceEditComponent } from './appliances/appliance-edit/appliance-edit.component';
import { AppliancesListComponent } from './appliances/appliances-list/appliances-list.component';
import { resolveAppliance } from './lib/resolve-appliance';
import { resolveUser } from './lib/resolve-user';
import { UserEditComponent } from './users/user-edit/user-edit.component';
import { UsersListComponent } from './users/users-list/users-list.component';

export default [
    {
        path: 'appliances',
        children: [
            {
                path: 'list',
                component: AppliancesListComponent,
            },
            {
                path: 'new',
                component: ApplianceEditComponent,
                canDeactivate: [canDeactivateGuard],
                data: {
                    appliance: null,
                }
            },
            {
                path: ':id',
                component: ApplianceEditComponent,
                canDeactivate: [canDeactivateGuard],
                resolve: {
                    appliance: resolveAppliance,
                }
            },
            {
                path: '',
                redirectTo: 'list',
                pathMatch: 'full',
            }
        ]
    },
    {
        path: 'users',
        children: [
            {
                path: 'list',
                component: UsersListComponent,
            },
            {
                path: ':id',
                component: UserEditComponent,
                resolve: {
                    user: resolveUser,
                },
                canDeactivate: [canDeactivateGuard],
            },
            {
                path: '',
                redirectTo: 'list',
                pathMatch: 'full',
            }
        ]
    },
] as Route[];