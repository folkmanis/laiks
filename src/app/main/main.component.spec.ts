import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideTestFirebase } from '@shared/firebase/test-firebase-provider';
import { LocalSettingsService } from '@shared/settings';
import { NumberSignPipe, TimeObserverService } from '@shared/utils';
import { Observable, of } from 'rxjs';
import { ClockDisplayComponent } from './clock-display/clock-display.component';
import { MainComponent } from './main.component';
import { SelectorComponent } from './selector/selector.component';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';

const TEST_TIME = new Date(2022, 10, 23, 21, 15, 0);
const TEST_OFFSET = 3;
const TEST_TIME_OFFSET = new Date(2022, 10, 24, 0, 15, 0);

class TestLaiksService {
  minuteObserver(): Observable<Date> {
    return of(TEST_TIME);
  }
}

describe('MainComponent', () => {
  let component: MainComponent;
  let fixture: ComponentFixture<MainComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [
        MainComponent,
        SelectorComponent,
        NumberSignPipe,
        ClockDisplayComponent,
      ],
      providers: [
        provideTestFirebase(),
        LocalSettingsService,
        { provide: TimeObserverService, useClass: TestLaiksService },
        provideExperimentalZonelessChangeDetection(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MainComponent);

    component = fixture.componentInstance;

    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set time with offset', async () => {
    component.onSetOffset(TEST_OFFSET);
    await fixture.whenStable();
    expect(+component.timeWithOffset()).toBe(+TEST_TIME_OFFSET);
  });
});
