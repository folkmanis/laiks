import { Directive, HostListener, Input, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { PresetPowerAppliance } from '@shared/appliances';

@Directive({
  selector: '[laiksSelectAppliance]',
  standalone: true,
})
export class SelectApplianceDirective {
  private dialogRef = inject(MatDialogRef);

  @Input('laiksSelectAppliance') appliance: PresetPowerAppliance | null = null;

  @Input() locale?: string;

  @HostListener('click') onClick() {
    if (!this.appliance) {
      this.dialogRef.close();
      return false;
    }
    const { localizedNames, ...appliance } = this.appliance;

    if (this.locale && localizedNames?.[this.locale]) {
      appliance.name = localizedNames[this.locale];
    }

    this.dialogRef.close(appliance);

    return false;
  }
}
