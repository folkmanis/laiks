import { AsyncPipe, JsonPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MarketZonesService, NpDataService } from '@shared/np-data';
import { catchError, finalize, map, of } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
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
    AsyncPipe,
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

  zones$ = inject(MarketZonesService).getZonesFlow();

  result = signal<Record<string, any> | null>(null);
  busy = signal(false);
  error = signal<Record<string, any> | null>(null);

  onScrapeAll(forced: boolean) {
    this.reset();

    this.npDataService
      .scrapeAllZones(forced)
      .pipe(
        catchError((err) => {
          this.error.set(err);
          return of(null);
        }),
        finalize(() => this.busy.set(false))
      )
      .subscribe((response) => {
        this.result.set(response);
      });
  }

  onScrapeZone(zoneId: string, forced: boolean) {
    this.reset();

    this.npDataService
      .scrapeZone(zoneId, forced)
      .pipe(
        catchError((err) => {
          this.error.set(err);
          return of(null);
        }),
        finalize(() => this.busy.set(false))
      )
      .subscribe((response) => {
        this.result.set(response);
      });
  }

  onDeleteInactiveUsers() {
    this.reset();

    this.usersService
      .deleteInactiveUsers()
      .pipe(
        catchError((err) => {
          this.error.set(err);
          return of(null);
        }),
        finalize(() => this.busy.set(false))
      )
      .subscribe((response) => {
        this.result.set(response);
      });
  }

  private reset() {
    this.result.set(null);
    this.busy.set(true);
    this.error.set(null);
  }
}
