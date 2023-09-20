import { AsyncPipe, NgFor } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { ConfirmationDialogService } from '@shared/confirmation-dialog';
import { MarketZonesService } from '@shared/np-data';
import { EMPTY, finalize, mergeMap } from 'rxjs';

@Component({
  selector: 'laiks-market-zones-list',
  standalone: true,
  templateUrl: './market-zones-list.component.html',
  styleUrls: ['./market-zones-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, NgFor, AsyncPipe, MatButtonModule, MatIconModule],
})
export class MarketZonesListComponent {
  private readonly zonesService = inject(MarketZonesService);
  private confirmation = inject(ConfirmationDialogService);

  zones$ = this.zonesService.getZonesFlow();

  busy = signal(false);

  onDelete(id: string) {
    this.busy.set(true);

    this.confirmation
      .delete()
      .pipe(
        mergeMap((resp) => (resp ? this.zonesService.deleteZone(id) : EMPTY)),
        finalize(() => this.busy.set(false))
      )
      .subscribe();
  }
}
