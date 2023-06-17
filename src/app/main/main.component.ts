import { AsyncPipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { addHours } from 'date-fns';
import { ClockDisplayComponent } from '../clock-display/clock-display.component';
import { NpDataService } from '../shared/np-data.service';
import { NpDataComponent } from '../np-data/np-data.component';
import { SelectorComponent } from '../selector/selector.component';
import { LaiksService } from '../shared/laiks.service';
import { PermissionsService } from '../shared/permissions.service';
import { SettingsService } from '../shared/settings.service';
import { map } from 'rxjs';


@Component({
  selector: 'laiks-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NgIf, NpDataComponent, SelectorComponent, ClockDisplayComponent, AsyncPipe]
})
export class MainComponent {

  npAllowed = toSignal(this.permissionsService.isNpAllowed());

  offset = this.settingsService.offset;
  private currentTime = toSignal(
    this.laiksService.minuteObserver(),
    { requireSync: true }
  );

  timeWithOffset = computed(
    () => addHours(this.currentTime(), this.offset())
  );

  npPrices$ = this.npService.getNpPrices();

  constructor(
    private laiksService: LaiksService,
    private settingsService: SettingsService,
    private npService: NpDataService,
    private permissionsService: PermissionsService,
  ) { }

  onSetOffset(value: number) {
    this.settingsService.setOffset(value);
  }


}
