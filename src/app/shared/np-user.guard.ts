import { inject } from '@angular/core';
import { CanMatchFn } from '@angular/router';
import { map, take } from 'rxjs';
import { PermissionsService } from './permissions.service';

export const canMatchNpUser: CanMatchFn = () =>
  inject(PermissionsService).getPermissions().pipe(
    take(1),
    map(data => data.npUser),
  );
