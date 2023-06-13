import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainComponent } from './main.component';
import { ClockDisplayComponent } from '../clock-display/clock-display.component';
import { SelectorComponent } from '../selector/selector.component';
import { addMinutes } from 'date-fns';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { NpDataComponent } from '../np-data/np-data.component';
import { NumberSignPipe } from '../shared/number-sign.pipe';
import { NpDataService } from '../np-data/lib/np-data.service';
import { LaiksService } from '../shared/laiks.service';
import { effect } from '@angular/core';
import { UserService } from '../shared/user.service';
import { SettingsService } from '../shared/settings.service';

const TEST_TIME = new Date(2022, 10, 23, 21, 15, 0);
const TEST_OFFSET = 3;
const TEST_TIME_OFFSET = new Date(2022, 10, 24, 0, 15, 0);

class TestLaiksService {
  minuteObserver(): Observable<Date> {
    return of(TEST_TIME);
  }
}

class TestUserService {
  isNpAllowed() {
    return new BehaviorSubject(true);
  }
}

class TestNpService {
  getNpPrices() {
    return of([]);
  }
}

describe('MainComponent', () => {
  let component: MainComponent;
  let fixture: ComponentFixture<MainComponent>;

  beforeEach(async () => {
    fixture = TestBed.configureTestingModule({
      imports: [
        MainComponent,
        SelectorComponent,
        NumberSignPipe,
        ClockDisplayComponent,
        NpDataComponent,
      ],
      providers: [
        { provide: LaiksService, useClass: TestLaiksService },
        { provide: UserService, useClass: TestUserService },
        { provide: SettingsService, useClass: SettingsService },
        { provide: NpDataService, useClass: TestNpService }
      ]
    })
      .createComponent(MainComponent);

    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set time with offset', () => {
    component.onSetOffset(TEST_OFFSET);
    // fixture.detectChanges();
    expect(+component.timeWithOffset()).toBe(+TEST_TIME_OFFSET);
  });


});
