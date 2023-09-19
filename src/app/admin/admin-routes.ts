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
] as Route[];
