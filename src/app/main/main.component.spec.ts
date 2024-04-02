import { ComponentFixture, TestBed } from '@angular/core/testing';

import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { LocalSettingsService } from '@shared/settings';
import { NumberSignPipe, TimeObserverService } from '@shared/utils';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ClockDisplayComponent } from './clock-display/clock-display.component';
import { MainComponent } from './main.component';
import { SelectorComponent } from './selector/selector.component';
import { testFirebaseProvider } from '@shared/firebase/test-firebase-provider';

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
        testFirebaseProvider,
        LocalSettingsService,
        { provide: TimeObserverService, useClass: TestLaiksService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MainComponent);

    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set time with offset', () => {
    component.onSetOffset(TEST_OFFSET);
    fixture.detectChanges();
    expect(+component.timeWithOffset()).toBe(+TEST_TIME_OFFSET);
  });
});
