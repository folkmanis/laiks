import { Route } from '@angular/router';
import { provideDateFnsAdapter } from '@angular/material-date-fns-adapter';
import { lv } from 'date-fns/locale';
import { MAT_DATE_LOCALE } from '@angular/material/core';

export default [
  {
    path: 'appliances',
    loadChildren: () => import('./appliances/appliances-routes'),
  },
  {
    path: 'users',
    loadChildren: () => import('./users/users-admin-routes'),
  },
  {
    path: 'market-zones',
    loadChildren: () => import('./market-zones/market-zones-routes'),
  },
  {
    path: 'special-actions',
    loadComponent: () =>
      import('./special-actions/special-actions.component').then(
        (c) => c.SpecialActionsComponent,
      ),
    providers: [
      provideDateFnsAdapter(),
      { provide: MAT_DATE_LOCALE, useValue: lv },
    ],
  },
  {
    path: '**',
    redirectTo: '/',
  },
] as Route[];
