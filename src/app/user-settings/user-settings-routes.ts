import { Route } from '@angular/router';
import { UserAppliancesComponent } from './user-appliances/user-appliances.component';
import { UserSettingsComponent } from './user-settings.component';
import { canMatchNpUser } from 'src/app/shared/np-user.guard';
import { EditUserApplianceComponent } from './user-appliances/edit-user-appliance/edit-user-appliance.component';
import { canDeactivateGuard } from '../shared/can-deactivate.guard';

export default [
    {
        path: '',
        component: UserSettingsComponent,
        canActivate: [canMatchNpUser],
        pathMatch: 'full,'
    },
    {
        path: 'appliances',
        canActivateChild: [canMatchNpUser],
        children: [
            {
                path: '',
                component: UserAppliancesComponent,
                pathMatch: 'full',
            },
            {
                path: 'new',
                component: EditUserApplianceComponent,
                canDeactivate: [canDeactivateGuard],
                data: {
                    id: null,
                },
            },
            {
                path: ':id',
                component: EditUserApplianceComponent,
                canDeactivate: [canDeactivateGuard],
            },
        ]
    },
    {
        path: '**',
        redirectTo: '',
    }
] as Route[];