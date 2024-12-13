import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import {
  ApplianceFormComponent,
  INITIAL_APPLIANCE,
  PowerAppliance,
  SystemAppliancesService,
} from '@shared/appliances';
import { ConfirmationDialogService } from '@shared/confirmation-dialog';
import { CanComponentDeactivate } from '@shared/utils';
import { navigateRelative } from '@shared/utils/navigate-relative';

@Component({
    selector: 'laiks-edit-system-appliances',
    imports: [
        ApplianceFormComponent,
        FormsModule,
        ReactiveFormsModule,
        MatButtonModule,
        RouterLink,
    ],
    templateUrl: './edit-system-appliances.component.html',
    styleUrls: ['./edit-system-appliances.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        class: 'vertical-container',
    }
})
export class EditSystemAppliancesComponent implements CanComponentDeactivate {
  private appliancesService = inject(SystemAppliancesService);
  private confirmation = inject(ConfirmationDialogService);
  private navigate = navigateRelative();

  id = input<string | null>(null);

  initialValue = input.required<PowerAppliance>({ alias: 'appliance' });

  busy = signal(false);

  applianceForm = new FormControl<PowerAppliance>(INITIAL_APPLIANCE, {
    nonNullable: true,
  });

  existingAppliances = toSignal(this.appliancesService.getPowerAppliances(), {
    initialValue: [],
  });

  constructor() {
    effect(
      () => {
        this.applianceForm.reset(this.initialValue());
      },
      { allowSignalWrites: true },
    );
  }

  canDeactivate = () =>
    this.applianceForm.pristine || this.confirmation.cancelEdit();

  async onSave() {
    const id = this.id();
    if (id) {
      await this.appliancesService.updateAppliance(
        id,
        this.applianceForm.value,
      );
    } else {
      const appliance = {
        ...this.applianceForm.value,
        localizedNames: {},
      };
      await this.appliancesService.createAppliance(appliance);
    }
    this.busy.set(false);
    this.applianceForm.markAsPristine();
    this.navigate(['..']);
  }
}
