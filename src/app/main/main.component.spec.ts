import { ComponentFixture, TestBed } from '@angular/core/testing';

import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ClockDisplayComponent } from '../clock-display/clock-display.component';
import { NpDataComponent } from '../np-data/np-data.component';
import { SelectorComponent } from '../selector/selector.component';
import { LaiksService } from '../shared/laiks.service';
import { NumberSignPipe } from '../shared/number-sign.pipe';
import { SettingsService } from '../shared/settings.service';
import { MainComponent } from './main.component';

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
        NpDataComponent,
        provideFirestore(() => getFirestore()),
        provideFirebaseApp(() => initializeApp(environment.firebase)),
        provideAuth(() => getAuth()),
      ],
      providers: [
        SettingsService,
        { provide: LaiksService, useClass: TestLaiksService },
      ]
    })
      .compileComponents();

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
