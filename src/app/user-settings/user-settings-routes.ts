import { Route } from '@angular/router';
import { UserAppliancesComponent } from './user-appliances/user-appliances.component';
import { UserSettingsComponent } from './user-settings.component';
import { canMatchNpUser } from 'src/app/shared/np-user.guard';

export default [
    {
        path: '',
        component: UserSettingsComponent,
        pathMatch: 'full,'
    },
    {
        path: 'appliances',
        component: UserAppliancesComponent,
        canActivate: [canMatchNpUser],
    },
    {
        path: '**',
        redirectTo: '',
    }
] as Route[];