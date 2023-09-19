import { AsyncPipe, NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  LoginService,
  NpDataService,
  SettingsService,
  TimeObserverService,
} from '@shared';
import { addHours } from 'date-fns';
import { ClockDisplayComponent } from './clock-display/clock-display.component';
import { SelectorComponent } from './selector/selector.component';
import { AppliancesSelectorComponent } from './appliances-selector/appliances-selector.component';
import { map } from 'rxjs';

@Component({
  selector: 'laiks-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgIf,
    SelectorComponent,
    ClockDisplayComponent,
    AsyncPipe,
    AppliancesSelectorComponent,
  ],
})
export class MainComponent {
  private settingsService = inject(SettingsService);

  private loginService = inject(LoginService);

  npAllowed = toSignal(this.loginService.isNpAllowed());

  appliances$ = this.loginService
    .laiksUser()
    .pipe(map((user) => user?.appliances));

  offset = this.settingsService.offset;
  private currentTime = toSignal(inject(TimeObserverService).minuteObserver(), {
    requireSync: true,
  });

  timeWithOffset = computed(() => addHours(this.currentTime(), this.offset()));

  npPrices$ = inject(NpDataService).getNpPrices();

  onSetOffset(value: number) {
    this.settingsService.setOffset(value);
  }
}
