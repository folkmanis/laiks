import { Route } from '@angular/router';
import { canDeactivateGuard } from '../shared/can-deactivate.guard';
import { ApplianceEditComponent } from './appliances/appliance-edit/appliance-edit.component';
import { AppliancesListComponent } from './appliances/appliances-list/appliances-list.component';
import { resolveAppliance } from './lib/resolve-appliance';
import { resolveUser } from './lib/resolve-user';
import { UserEditComponent } from './users/user-edit/user-edit.component';
import { UsersListComponent } from './users/users-list/users-list.component';
import { INITIAL_APPLIANCE } from 'src/app/shared/appliance-form/appliance-form.component';
import { resolveActiveUserId } from '../shared/resolve-active-user-id';

export default [
    {
        path: 'appliances',
        children: [
            {
                path: 'new',
                component: ApplianceEditComponent,
                canDeactivate: [canDeactivateGuard],
                data: {
                    appliance: INITIAL_APPLIANCE,
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
                component: AppliancesListComponent,
                pathMatch: 'full',
            }
        ]
    },
    {
        path: 'users',
        children: [
            {
                path: ':id',
                component: UserEditComponent,
                resolve: {
                    user: resolveUser,
                    activeUserId: resolveActiveUserId,
                },
                canDeactivate: [canDeactivateGuard],
            },
            {
                path: '',
                component: UsersListComponent,
                pathMatch: 'full',
                resolve: {
                    activeUserId: resolveActiveUserId
                }
            }
        ]
    },
] as Route[];