import { Directive, inject, input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { PresetPowerAppliance } from '@shared/appliances';

@Directive({
  selector: '[laiksSelectAppliance]',
  standalone: true,
  host: {
    '(click)': 'onClick()'
  }
})
export class SelectApplianceDirective {

  private dialogRef = inject(MatDialogRef);

  appliance = input.required<PresetPowerAppliance>({ alias: 'laiksSelectAppliance' });

  locale = input<string>();

  onClick() {

    const { localizedNames, ...appliance } = this.appliance();

    const locale = this.locale();
    if (locale && localizedNames?.[locale]) {
      appliance.name = localizedNames[locale];
    }

    this.dialogRef.close(appliance);

    return false;
  }
}
