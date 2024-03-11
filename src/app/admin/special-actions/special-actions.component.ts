import { JsonPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MarketZonesService, NpDataService } from '@shared/np-data';
import { UsersService } from '@shared/users';

@Component({
  selector: 'laiks-special-actions',
  standalone: true,
  imports: [
    MatButtonModule,
    JsonPipe,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
  ],
  templateUrl: './special-actions.component.html',
  styleUrl: './special-actions.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpecialActionsComponent {
  private npDataService = inject(NpDataService);
  private usersService = inject(UsersService);

  zones = toSignal(inject(MarketZonesService).getZonesFlow());

  result = signal<Record<string, any> | null>(null);
  busy = signal(false);
  error = signal<Record<string, any> | null>(null);

  async onScrapeAll(forced: boolean) {
    this.reset();

    try {

      const result = await this.npDataService.scrapeAllZones(forced);
      this.result.set(result);

    } catch (error) {
      this.error.set(error as Error);
      this.result.set(null);
    }
    this.busy.set(false);
  }

  async onScrapeZone(zoneId: string, forced: boolean) {
    this.reset();

    try {

      const result = await this.npDataService.scrapeZone(zoneId, forced);
      this.result.set(result);

    } catch (error) {
      this.error.set(error as Error);
      this.result.set(null);
    }
    this.busy.set(false);
  }

  async onDeleteInactiveUsers() {
    this.reset();
    try {

      const response = await this.usersService.deleteInactiveUsers();
      this.result.set(response);

    } catch (error) {
      this.error.set(error as Error);
      this.result.set(null);
    }
    this.busy.set(false);
  }

  private reset() {
    this.result.set(null);
    this.busy.set(true);
    this.error.set(null);
  }
}
