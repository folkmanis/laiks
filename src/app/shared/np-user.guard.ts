import { inject } from '@angular/core';
import { CanMatchFn } from '@angular/router';
import { map, take } from 'rxjs';
import { UserService } from './user.service';

export const canMatchNpUser: CanMatchFn = () =>
  inject(UserService).laiksUser().pipe(
    take(1),
    map(user => !!user?.npAllowed),
  );
