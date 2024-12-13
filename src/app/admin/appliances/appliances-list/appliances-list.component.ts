import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MatCheckboxChange,
  MatCheckboxModule,
} from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { ColorTagComponent, SystemAppliancesService } from '@shared/appliances';
import { ConfirmationDialogService } from '@shared/confirmation-dialog';
import { ApplianceDeletedSnackComponent } from 'src/app/shared/appliances';

@Component({
    selector: 'laiks-appliances-list',
    templateUrl: './appliances-list.component.html',
    styleUrls: ['./appliances-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        MatTableModule,
        MatButtonModule,
        RouterLink,
        MatCheckboxModule,
        MatIconModule,
        ColorTagComponent,
    ]
})
export class AppliancesListComponent {
  displayColumns = ['color', 'name', 'buttons'];

  private appliancesService = inject(SystemAppliancesService);
  private confirmation = inject(ConfirmationDialogService);
  private snack = inject(MatSnackBar);

  appliances$ = this.appliancesService.getPowerAppliances();

  busy = signal(false);

  async onEnable(event: MatCheckboxChange, id: string) {
    this.busy.set(true);
    await this.appliancesService.updateAppliance(id, {
      enabled: event.checked,
    });
    this.busy.set(false);
  }

  async onDelete(id: string, name: string) {
    this.busy.set(true);
    if (await this.confirmation.delete()) {
      await this.appliancesService.deleteAppliance(id);
      this.snack.openFromComponent(ApplianceDeletedSnackComponent, {
        data: name,
      });
    }
    this.busy.set(false);
  }
}
