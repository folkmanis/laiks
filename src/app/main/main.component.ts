import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NpDataService } from '@shared/np-data';
import { LocalSettingsService } from '@shared/settings';
import { LoginService, isNpAllowed } from '@shared/users';
import { TimeObserverService } from '@shared/utils';
import { addHours } from 'date-fns';
import { AppliancesSelectorComponent } from './appliances-selector/appliances-selector.component';
import { ClockDisplayComponent } from './clock-display/clock-display.component';
import { SelectorComponent } from './selector/selector.component';

@Component({
  selector: 'laiks-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    SelectorComponent,
    ClockDisplayComponent,
    AppliancesSelectorComponent,
  ],
})
export class MainComponent {
  private settingsService = inject(LocalSettingsService);

  private laiksUser = toSignal(inject(LoginService).laiksUser$);

  appliances = computed(() => {
    return this.laiksUser()?.appliances || [];
  });

  npAllowed = isNpAllowed();

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
