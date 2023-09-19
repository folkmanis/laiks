import { inject } from '@angular/core';
import { CanMatchFn, CanActivateFn, Router } from '@angular/router';
import { LoginService } from '@shared';
import { first, map, tap } from 'rxjs';

export const userApplianceGuard: CanActivateFn = (route) => {
  const redirect = inject(Router).parseUrl('/');
  const idx = route.paramMap.get('idx');
  return (
    !!idx &&
    inject(LoginService)
      .laiksUser()
      .pipe(
        first(),
        map((user) => user && !!user.appliances[+idx]),
        map((valid) => valid || redirect)
      )
  );
};
