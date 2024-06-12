import { Injectable } from '@angular/core';
import { addDays, addMinutes, startOfDay, startOfMinute } from 'date-fns';
import { Observable, defer, of, repeat, timer } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TimeObserverService {
  minuteObserver(): Observable<Date> {
    return defer(() => of(new Date())).pipe(
      repeat({
        delay: () => timer(this.timeToNextMinute()),
      }),
    );
  }

  dayObserver(): Observable<Date> {
    return defer(() => of(new Date())).pipe(
      repeat({
        delay: () => timer(this.timeToNextDay()),
      }),
    );
  }

  timeToNextMinute(now = new Date()): number {
    return +startOfMinute(addMinutes(now, 1)) - +now;
  }

  timeToNextDay(now = new Date()): number {
    return +startOfDay(addDays(now, 1)) - +now;
  }
}
