import { Route } from '@angular/router';
import { MainComponent } from './main/main.component';
import { PricesComponent } from './prices/prices.component';
import { canMatchAdmin } from './shared/admin.guard';
import { canMatchNpUser } from './shared/np-user.guard';

export const APP_ROUTES: Route[] = [
    {
        path: 'clock-offset',
        component: MainComponent,
    },
    {
        path: 'prices',
        component: PricesComponent,
        canMatch: [canMatchNpUser],
    },
    {
        path: 'admin',
        loadChildren: () => import('./admin/admin-routes'),
        canMatch: [canMatchAdmin],
    },
    {
        path: '',
        redirectTo: 'clock-offset',
        pathMatch: 'full',
    },
    {
        path: '**',
        redirectTo: 'clock-offset',
    }

];