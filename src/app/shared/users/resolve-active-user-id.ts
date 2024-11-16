import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { LoginService } from './login.service';

export const resolveActiveUserId: ResolveFn<string | undefined> = async () => {
  const user = await firstValueFrom(inject(LoginService).user$);
  return user?.uid;
};
