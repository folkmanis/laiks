import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
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
  imports: [RouterLink, MatButtonModule, MatIconModule],
})
export class MarketZonesListComponent {
  private readonly zonesService = inject(MarketZonesService);
  private confirmation = inject(ConfirmationDialogService);

  zones = toSignal(this.zonesService.getZonesFlow(), { initialValue: [] });

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
