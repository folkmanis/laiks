import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { first } from 'rxjs';
import { WithId, throwIfNull } from '@shared/utils';
import { LaiksUser } from './laiks-user';
import { LoginService } from './login.service';

export const resolveActiveUser: ResolveFn<WithId<LaiksUser>> = () =>
  inject(LoginService).laiksUserObserver().pipe(throwIfNull(), first());
