import { ResolveFn } from '@angular/router';
import { UserService } from './user.service';
import { Auth, authState, GoogleAuthProvider, signInWithPopup, signOut, User } from '@angular/fire/auth';
import { inject } from '@angular/core';
import { map } from 'rxjs';

export const resolveActiveUserId: ResolveFn<string | undefined> = () =>
    inject(UserService).getUser().pipe(map(user => user?.uid));