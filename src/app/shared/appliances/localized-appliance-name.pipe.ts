import { Pipe, PipeTransform } from '@angular/core';
import { PresetPowerAppliance } from './power-appliance.interface';

@Pipe({
  name: 'localizedApplianceName',
  standalone: true,
})
export class LocalizedApplianceNamePipe implements PipeTransform {
  transform(value: PresetPowerAppliance, locale?: string): string {
    if (locale && value.localizedNames?.[locale]) {
      return value.localizedNames[locale];
    } else {
      return value.name;
    }
  }
}
