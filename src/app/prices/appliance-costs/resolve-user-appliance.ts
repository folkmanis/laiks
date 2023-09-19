import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { PowerAppliance, LoginService, throwIfNull } from '@shared';
import { first, map } from 'rxjs';

export const resolveUserAppliance: ResolveFn<PowerAppliance> = (route) => {
  return inject(LoginService)
    .laiksUser()
    .pipe(
      first(),
      map((user) => user!.appliances[+route.paramMap.get('idx')!])
    );
};
