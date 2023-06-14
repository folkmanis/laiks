import { inject } from '@angular/core';
import { CanMatchFn } from '@angular/router';
import { EMPTY, catchError, map, of, take } from 'rxjs';
import { UserService } from './user.service';

export const canMatchAdmin: CanMatchFn = () => {
  return inject(UserService).isAdmin().pipe(
    take(1),
  );

}

