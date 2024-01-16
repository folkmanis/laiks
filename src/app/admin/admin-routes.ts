import { Route } from '@angular/router';

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
        (c) => c.SpecialActionsComponent
      ),
  },
  {
    path: '**',
    redirectTo: '/',
  },
] as Route[];
