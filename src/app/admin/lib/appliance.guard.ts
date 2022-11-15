import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { ApplianceEditComponent } from '../appliances/appliance-edit/appliance-edit.component';

@Injectable({
  providedIn: 'root'
})
export class ApplianceGuard implements CanDeactivate<ApplianceEditComponent> {
  canDeactivate(
    component: ApplianceEditComponent,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return component.canDeactivate();
  }

}
