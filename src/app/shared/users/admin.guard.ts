import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { first } from 'rxjs';
import { LoginService } from './login.service';

export const canActivateAdmin: CanActivateFn = () => {
  return inject(LoginService).isAdmin().pipe(first());
};
