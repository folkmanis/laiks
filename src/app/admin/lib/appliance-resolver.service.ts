import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { catchError, EMPTY, Observable } from 'rxjs';
import { PowerAppliance } from 'src/app/np-data/lib/power-appliance.interface';
import { PowerAppliancesService } from 'src/app/np-data/lib/power-appliances.service';

@Injectable({
  providedIn: 'root'
})
export class ApplianceResolverService implements Resolve<PowerAppliance | null> {

  constructor(
    private appliancesService: PowerAppliancesService,
    private snack: MatSnackBar,
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): null | PowerAppliance | Observable<PowerAppliance | null> {
    const id = route.paramMap.get('id');

    if (!id) {
      return EMPTY;
    }

    if (id === 'new') {
      return null;
    }

    return this.appliancesService.getAppliance(id).pipe(
      catchError(err => {
        this.snack.open(err, 'OK', { duration: 3000 });
        return EMPTY;
      })
    );

  }
}
