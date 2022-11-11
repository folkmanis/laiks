import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { addHours } from 'date-fns';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { UserService } from '../shared/user.service';
import { LaiksService } from '../shared/laiks.service';
import { map, Observable, Subject, merge, combineLatest, of } from 'rxjs';



@Component({
  selector: 'laiks-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainComponent implements OnInit {

  npAllowed$ = this.userService.isNpAllowed();

  initialOffset = this.laiksService.getSettings().offset;

  offsetChange$ = new Subject<number>();

  currentTime$ = this.laiksService.minuteObserver();

  timeWithOffset$: Observable<Date> = combineLatest({
    time: this.currentTime$,
    offset: merge(of(this.initialOffset), this.offsetChange$)
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
