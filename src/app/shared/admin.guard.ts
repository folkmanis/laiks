import { Injectable } from '@angular/core';
import { Route, Router, UrlSegment, UrlTree } from '@angular/router';
import { map, Observable, take } from 'rxjs';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard  {

  constructor(
    private userService: UserService,
    private router: Router,
  ) { }


  canLoad(
    route: Route,
    segments: UrlSegment[]
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    return this.userService.laiksUser().pipe(
      take(1),
      map(user => user?.isAdmin ? true : this.router.parseUrl('/')),
    );

  }
}
