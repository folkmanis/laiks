import { inject } from '@angular/core';
import { CanMatchFn } from '@angular/router';
import { first } from 'rxjs';
import { LoginService } from './login.service';

export const canMatchAdmin: CanMatchFn = () => {
  return inject(LoginService).isAdmin().pipe(first());
};
