import { inject } from '@angular/core';
import { CanMatchFn } from '@angular/router';
import { map, take } from 'rxjs';
import { PermissionsService } from './permissions.service';

export const canMatchAdmin: CanMatchFn = () => {
  return inject(PermissionsService).getPermissions().pipe(
    take(1),
    map(data => data.admin),
  );

}

