import { inject } from '@angular/core';
import {
  CanActivateFn,
  Router,
  createUrlTreeFromSnapshot,
} from '@angular/router';
import { first, map } from 'rxjs';
import { LoginService } from './login.service';

export const loginGuard: CanActivateFn = (route) => {
  const router = inject(Router);

  return inject(LoginService)
    .isLogin()
    .pipe(
      first(),
      map(
        (isLogin) =>
          isLogin ||
          router.createUrlTree(['login'], {
            queryParams: { redirect: createUrlTreeFromSnapshot(route, []) },
          })
      )
    );
};
