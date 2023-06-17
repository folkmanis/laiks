import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ResolveFn } from '@angular/router';
import { EMPTY, catchError } from 'rxjs';
import { PowerAppliance } from 'src/app/shared/power-appliance.interface';
import { PowerAppliancesService } from 'src/app/shared/power-appliances.service';

export const resolveAppliance: ResolveFn<PowerAppliance> = (route) => {
    const snack = inject(MatSnackBar);
    return inject(PowerAppliancesService)
        .getAppliance(route.paramMap.get('id')!)
        .pipe(
            catchError(err => {
                snack.open(err, 'OK', { duration: 3000 });
                return EMPTY;
            })
        );
};