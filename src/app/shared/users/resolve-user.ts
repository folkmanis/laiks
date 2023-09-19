import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { LaiksUser } from 'src/app/shared/users/laiks-user';
import { UsersService } from '../../shared/users/users.service';

export const resolveUser: ResolveFn<LaiksUser> = (route) => {
  const id = route.paramMap.get('id')!;
  return inject(UsersService).getUserById(id);
};
