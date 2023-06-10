import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { addHours } from 'date-fns';
import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';
import { LaiksService } from '../shared/laiks.service';
import { UserService } from '../shared/user.service';
import { ClockDisplayComponent } from '../clock-display/clock-display.component';
import { SelectorComponent } from '../selector/selector.component';
import { NpDataComponent } from '../np-data/np-data.component';
import { NgIf, AsyncPipe } from '@angular/common';



@Component({
    selector: 'laiks-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [NgIf, NpDataComponent, SelectorComponent, ClockDisplayComponent, AsyncPipe]
})
export class MainComponent implements OnInit {

  npAllowed$ = this.userService.isNpAllowed();

  initialOffset = this.laiksService.getSettings().offset;

  offsetChange$ = new BehaviorSubject<number>(this.initialOffset);

  currentTime$ = this.laiksService.minuteObserver();

  timeWithOffset$: Observable<Date> = combineLatest({
    time: this.currentTime$,
    offset: this.offsetChange$,
  }).pipe(
    map(({ time, offset }) => addHours(time, offset)),
  );


  constructor(
    private userService: UserService,
    private laiksService: LaiksService,
  ) { }

  ngOnInit(): void {
  }


  onOffsetChange(value: number) {

    this.offsetChange$.next(value);
    this.laiksService.setSettings({ offset: value });

  }


}
