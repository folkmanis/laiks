import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { map } from 'rxjs';
import { LoginService } from './login.service';

export const resolveActiveUserId: ResolveFn<string | undefined> = () =>
  inject(LoginService)
    .getUser()
    .pipe(map((user) => user?.uid));
