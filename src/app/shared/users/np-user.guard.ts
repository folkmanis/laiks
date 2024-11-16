import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { LoginService } from './login.service';

export const npUserGuard: CanActivateFn = () =>
  firstValueFrom(inject(LoginService).npAllowed$);
