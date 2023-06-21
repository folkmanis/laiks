import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { AsyncPipe, CommonModule, NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MarketZonesService } from 'src/app/shared/market-zones.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { EMPTY, finalize, mergeMap } from 'rxjs';
import { ConfirmationDialogService } from 'src/app/shared/confirmation-dialog/confirmation-dialog.service';

@Component({
  selector: 'laiks-market-zones-list',
  standalone: true,
  templateUrl: './market-zones-list.component.html',
  styleUrls: ['./market-zones-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    NgFor,
    AsyncPipe,
    MatButtonModule,
    MatIconModule,
  ],
})
export class MarketZonesListComponent {

  private readonly zonesService = inject(MarketZonesService);
  private confirmation = inject(ConfirmationDialogService);

  zones$ = this.zonesService.getZonesFlow();

  busy = signal(false);

  onDelete(id: string) {

    this.busy.set(true);

    this.confirmation.delete().pipe(
      mergeMap(resp => resp ? this.zonesService.deleteZone(id) : EMPTY),
      finalize(() => this.busy.set(false))
    ).subscribe();

  }


}
