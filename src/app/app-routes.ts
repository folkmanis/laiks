import { Route } from '@angular/router';
import { MainComponent } from './main/main.component';
import { PricesComponent } from './prices/prices.component';
import { canMatchAdmin } from './shared/admin.guard';
import { canMatchNpUser } from './shared/np-user.guard';
import { inject } from '@angular/core';
import { UserService } from './shared/user.service';
import { first } from 'rxjs';

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
        path: 'user-settings',
        loadChildren: () => import('./user-settings/user-settings-routes'),
        canMatch: [() => inject(UserService).isLogin().pipe(first())],
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