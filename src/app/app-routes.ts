import { inject } from '@angular/core';
import { Route } from '@angular/router';
import { first } from 'rxjs';
import { MainComponent } from './main/main.component';
import { canMatchAdmin } from './shared/users/admin.guard';
import { LoginService } from './shared/users/login.service';
import { canMatchNpUser } from './shared/users/np-user.guard';

export const APP_ROUTES: Route[] = [
  {
    path: 'clock-offset',
    component: MainComponent,
  },
  {
    path: 'prices',
    loadChildren: () => import('./prices/prices-routes'),
    canMatch: [canMatchNpUser],
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin-routes'),
    canMatch: [canMatchAdmin],
  },
  {
    path: 'user-settings',
    canMatch: [() => inject(LoginService).isLogin().pipe(first())],
    loadChildren: () => import('./user-settings/user-settings-routes'),
  },
  {
    path: 'privacy-politics',
    loadComponent: () =>
      import('./privacy-politics/privacy-politics.component').then(
        (c) => c.PrivacyPoliticsComponent
      ),
  },
  {
    path: '',
    redirectTo: 'clock-offset',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'clock-offset',
  },
];
