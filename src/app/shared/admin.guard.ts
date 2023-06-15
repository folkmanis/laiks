import { inject } from '@angular/core';
import { CanMatchFn } from '@angular/router';
import { first } from 'rxjs';
import { PermissionsService } from './permissions.service';

export const canMatchAdmin: CanMatchFn = () => {
  return inject(PermissionsService).isAdmin().pipe(first());
}

