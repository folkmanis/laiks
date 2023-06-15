import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ResolveFn } from '@angular/router';
import { EMPTY, catchError } from 'rxjs';
import { LaiksUser } from 'src/app/shared/laiks-user';
import { UsersAdminService } from './users-admin.service';

export const resolveUser: ResolveFn<LaiksUser> = (route) => {
    const snack = inject(MatSnackBar);
    const id = route.paramMap.get('id')!;
    return inject(UsersAdminService).getUserById(id).pipe(
        catchError(() => {
            snack.open(`Lietotājs ${id} nav atrasts.`, 'OK', { duration: 3000 });
            return EMPTY;
        })
    );
};