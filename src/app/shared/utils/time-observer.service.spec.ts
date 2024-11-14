import { provideExperimentalZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TimeObserverService } from './time-observer.service';

describe('TimeObserverService', () => {
  let service: TimeObserverService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TimeObserverService,
        provideExperimentalZonelessChangeDetection(),
      ],
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
});
