import { inject } from '@angular/core';
import { CanMatchFn } from '@angular/router';
import { map, take } from 'rxjs';
import { UserService } from './user.service';

export const canMatchAdmin: CanMatchFn = () => {
  return inject(UserService).laiksUser().pipe(
    take(1),
    map(user => !!user?.isAdmin),
  );

}

