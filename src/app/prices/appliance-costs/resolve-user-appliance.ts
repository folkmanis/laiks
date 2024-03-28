import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { PowerAppliance } from '@shared/appliances';
import { LoginService } from '@shared/users';
import { first, map } from 'rxjs';

export const resolveUserAppliance: ResolveFn<PowerAppliance> = (route) => {
  return inject(LoginService)
    .laiksUserObserver()
    .pipe(
      first(),
      map((user) => user!.appliances[+route.paramMap.get('idx')!])
    );
};
