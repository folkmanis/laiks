import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MatCheckboxChange,
  MatCheckboxModule,
} from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import {
  ColorTagComponent,
  PowerAppliance,
  SystemAppliancesService,
} from '@shared/appliances';
import { ConfirmationDialogService } from '@shared/confirmation-dialog';
import { Observable } from 'rxjs';

@Component({
  selector: 'laiks-appliances-list',
  templateUrl: './appliances-list.component.html',
  styleUrls: ['./appliances-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatTableModule,
    MatButtonModule,
    RouterLink,
    MatCheckboxModule,
    MatIconModule,
    ColorTagComponent,
  ],
})
export class AppliancesListComponent {
  displayColumns = ['color', 'name', 'buttons'];

  private appliancesService = inject(SystemAppliancesService);
  private confirmation = inject(ConfirmationDialogService);

  appliances$ = this.appliancesService.getPowerAppliances();

  busy = signal(false);

  async onEnable(event: MatCheckboxChange, id: string) {
    this.busy.set(true);
    await this.appliancesService
      .updateAppliance(id, { enabled: event.checked });
    this.busy.set(false);
  }

  async onDelete(id: string) {
    this.busy.set(true);
    const confirmation = await this.confirmation.delete();
    confirmation && await this.appliancesService.deleteAppliance(id);
    this.busy.set(false);
  }

}
