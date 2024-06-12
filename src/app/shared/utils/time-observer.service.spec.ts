import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { take } from 'rxjs';
import { TimeObserverService } from './time-observer.service';

describe('TimeObserverService', () => {
  let service: TimeObserverService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TimeObserverService],
    });
    service = TestBed.inject(TimeObserverService);
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });

  it('should calculate ms to next minute', () => {
    const now = new Date();
    now.setMilliseconds(0);
    now.setSeconds(0);
    // 1 min = 60 s, 1 s = 1000 ms
    expect(service.timeToNextMinute(now))
      .withContext('at zero')
      .toBe(60 * 1000);
    now.setSeconds(10);
    expect(service.timeToNextMinute(now))
      .withContext('at minute')
      .toBe(50 * 1000);
  });

  it('should calculate ms to next day', () => {
    const now = new Date();
    now.setMilliseconds(0);
    now.setSeconds(0);
    now.setMinutes(0);
    now.setHours(0);
    // 1 day = 24 h, 1 h = 60 min, 1 min = 60 s, 1 s = 1000 ms
    expect(service.timeToNextDay(now))
      .withContext('at zero')
      .toBe(24 * 60 * 60 * 1000);
    now.setHours(3, 20, 10);
    const interval = 74390 * 1000; // 20 h, 39 min, 50 s
    expect(service.timeToNextDay(now)).withContext('at day').toBe(interval);
  });

  it('should emit on each minute', fakeAsync(() => {
    const start = new Date();
    const toNext = service.timeToNextMinute(start);
    let minute = new Date();
    service
      .minuteObserver()
      .pipe(take(3))
      .subscribe((data) => (minute = data));
    tick(0);
    expect(minute.getTime()).withContext('initial').toBe(start.getTime());
    tick(toNext);
    expect(minute.getMinutes())
      .withContext('next minute')
      .toBe(start.getMinutes() + 1);
    tick(60 * 1000);
    expect(minute.getMinutes())
      .withContext('second minute')
      .toBe(start.getMinutes() + 2);
  }));

  it('should emit on each day', fakeAsync(() => {
    const start = new Date();
    const toNext = service.timeToNextDay(start);
    let day = new Date();
    service
      .dayObserver()
      .pipe(take(3))
      .subscribe((data) => (day = data));
    tick(0);
    expect(day.getTime()).withContext('initial').toBe(start.getTime());
    tick(toNext);
    expect(day.getDate())
      .withContext('next day')
      .toBe(start.getDate() + 1);
    tick(86400 * 1000);
    expect(day.getDate())
      .withContext('second day')
      .toBe(start.getDate() + 2);
  }));
});
