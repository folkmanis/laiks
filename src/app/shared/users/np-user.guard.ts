import { inject } from '@angular/core';
import { CanMatchFn } from '@angular/router';
import { first } from 'rxjs';
import { LoginService } from './login.service';

export const canMatchNpUser: CanMatchFn = () =>
  inject(LoginService).isNpAllowed().pipe(first());
