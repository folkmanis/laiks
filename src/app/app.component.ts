import { OnInit, Component, ChangeDetectionStrategy } from '@angular/core';
import { addHours } from 'date-fns';
import { Observable } from 'rxjs';
import { LaiksService } from './lib/laiks.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {

  currentTime$ = this.laiksService.minuteObserver();

  initialOffset: number = 1;

  constructor(
    private laiksService: LaiksService,
  ) { }

  ngOnInit(): void {
    this.initialOffset = this.laiksService.getSettings().offset;
  }

  onOffsetChange(offset: number) {
    this.laiksService.setSettings({ offset });
  }

}
