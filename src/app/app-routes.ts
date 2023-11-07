import { inject } from '@angular/core';
import { Route } from '@angular/router';
import { first } from 'rxjs';
import { MainComponent } from './main/main.component';
import { canActivateAdmin } from './shared/users/admin.guard';
import { LoginService } from './shared/users/login.service';
import { npUserGuard } from './shared/users/np-user.guard';
import { loginGuard } from '@shared/users';

export const APP_ROUTES: Route[] = [
  {
    path: 'clock-offset',
    component: MainComponent,
  },
  {
    path: 'prices',
    loadChildren: () => import('./prices/prices-routes'),
    canActivate: [loginGuard, npUserGuard],
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin-routes'),
    canActivate: [loginGuard, canActivateAdmin],
  },
  {
    path: 'user-settings',
    canActivate: [loginGuard],
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
    path: 'login',
    loadComponent: () =>
      import('./login/login.component').then((c) => c.LoginComponent),
  },
  {
    path: 'create-user',
    loadComponent: () =>
      import('./login/create-user/create-user.component').then(
        (c) => c.CreateUserComponent
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
