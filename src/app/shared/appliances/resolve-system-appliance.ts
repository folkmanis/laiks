import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { PowerAppliance } from '@shared/appliances';
import { SystemAppliancesService } from './system-appliances.service';

export const resolveSystemAppliance: ResolveFn<PowerAppliance> = (route) => {
  return inject(SystemAppliancesService).getAppliance(
    route.paramMap.get('id')!
  );
};
