import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { first } from 'rxjs';
import { LoginService } from './login.service';

export const npUserGuard: CanActivateFn = () =>
  inject(LoginService).isNpAllowed().pipe(first());
