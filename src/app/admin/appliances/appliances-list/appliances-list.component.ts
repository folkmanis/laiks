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
  PowerAppliance,
  SystemAppliancesService,
  ColorTagComponent,
} from '@shared/appliances';
import { ConfirmationDialogService } from '@shared/confirmation-dialog';
import { EMPTY, Observable, finalize, mergeMap } from 'rxjs';

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

  appliances$: Observable<PowerAppliance[]> =
    this.appliancesService.getPowerAppliances();

  busy = signal(false);

  onEnable(event: MatCheckboxChange, id: string) {
    this.busy.set(true);
    this.appliancesService
      .updateAppliance(id, { enabled: event.checked }).pipe(
        finalize(() => this.busy.set(false)),
      )
      .subscribe();
  }

  onDelete(id: string) {
    this.busy.set(true);
    this.confirmation.delete().pipe(
      mergeMap(response => response ? this.appliancesService.deleteAppliance(id) : EMPTY),
      finalize(() => this.busy.set(false)),
    )
      .subscribe();
  }

}
