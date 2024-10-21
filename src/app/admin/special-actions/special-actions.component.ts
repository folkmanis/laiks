import { JsonPipe } from '@angular/common';
import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  model,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NpDataService } from '@shared/np-data';
import { ScrapeZoneResult } from '@shared/np-data/scrape-zone-result';
import { UsersService } from '@shared/users';
import { DeleteInactiveUsersResult } from '@shared/users/delete-inactive-result';
import { addDays, isValid } from 'date-fns';

type Result = ScrapeZoneResult | ScrapeZoneResult[] | DeleteInactiveUsersResult;

@Component({
  selector: 'laiks-special-actions',
  standalone: true,
  imports: [
    MatButtonModule,
    JsonPipe,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatIcon,
    MatInputModule,
    FormsModule,
  ],
  templateUrl: './special-actions.component.html',
  styleUrl: './special-actions.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'vertical-container',
  },
})
export class SpecialActionsComponent {
  private npDataService = inject(NpDataService);
  private usersService = inject(UsersService);

  dateToScrape = model<Date | null>(null);
  dateToScrapeValid = computed(() => isValid(this.dateToScrape()));

  tomorrow = addDays(new Date(), 1);

  result = signal<Result | null>(null);
  busy = signal(false);
  error = signal<Error | null>(null);

  constructor() {
    afterNextRender({
      write: () => this.dateToScrape.set(this.tomorrow),
    });
  }

  async onScrapeAll(date?: Date | null) {
    this.reset();

    try {
      const result = await this.npDataService.scrapeAllZones(date);
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
