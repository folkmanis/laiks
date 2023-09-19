import { Injectable } from '@angular/core';
import { addMinutes, startOfMinute } from 'date-fns';
import { defer, Observable, of, repeat, timer } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TimeObserverService {
  minuteObserver(): Observable<Date> {
    return defer(() => of(new Date())).pipe(
      repeat({
        delay: () => timer(this.timeToNextMinute()),
      })
    );
  }

  private timeToNextMinute(): number {
    const now = new Date();
    return +startOfMinute(addMinutes(now, 1)) - +now;
  }
}
