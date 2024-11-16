import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { LoginService } from './login.service';

export const loginGuard: CanActivateFn = async (_, state) => {
  const router = inject(Router);
  const redirectUrl = router.createUrlTree(['/login'], {
    queryParams: { redirect: state.url },
  });
  try {
    const isLoggedIn = await firstValueFrom(inject(LoginService).login$);
    return isLoggedIn || redirectUrl;
  } catch (error) {
    return redirectUrl;
  }
};
