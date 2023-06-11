import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { addHours } from 'date-fns';
import { ClockDisplayComponent } from '../clock-display/clock-display.component';
import { NpDataComponent } from '../np-data/np-data.component';
import { SelectorComponent } from '../selector/selector.component';
import { LaiksService } from '../shared/laiks.service';
import { SettingsService } from '../shared/settings.service';
import { UserService } from '../shared/user.service';


@Component({
  selector: 'laiks-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NgIf, NpDataComponent, SelectorComponent, ClockDisplayComponent]
})
export class MainComponent {

  npAllowed = toSignal(
    this.userService.isNpAllowed(),
    { initialValue: false }
  );

  offset = this.settingsService.offset;
  private currentTime = toSignal(
    this.laiksService.minuteObserver(),
    { requireSync: true }
  );

  timeWithOffset = computed(
    () => addHours(this.currentTime(), this.offset())
  );


  constructor(
    private userService: UserService,
    private laiksService: LaiksService,
    private settingsService: SettingsService,
  ) { }

  onSetOffset(value: number) {
    this.settingsService.setOffset(value);
  }


}
