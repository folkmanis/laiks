import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, catchError, EMPTY } from 'rxjs';
import { LaiksUser } from 'src/app/shared/laiks-user';
import { UsersService } from './users.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class UserResolverService  {

  constructor(
    private usersService: UsersService,
    private router: Router,
    private snack: MatSnackBar,
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): LaiksUser | Observable<LaiksUser> | Promise<LaiksUser> {

    const id = route.paramMap.get('id');
    if (!id) {
      return EMPTY;
    }

    return this.usersService.getUserById(id).pipe(
      catchError(() => {
        this.snack.open(`Lietotājs ${id} nav atrasts.`, 'OK', { duration: 3000 });
        this.router.navigate(['admin', 'users']);
        return EMPTY;
      })
    );

  }
}
