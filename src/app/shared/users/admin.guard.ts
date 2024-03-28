import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { LoginService } from './login.service';

export const canActivateAdmin: CanActivateFn = () => {
  return firstValueFrom(inject(LoginService).adminObserver());
};
