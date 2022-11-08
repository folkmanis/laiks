import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { SelectorComponent } from './selector/selector.component';
import { SharedModule } from './shared/shared.module';
import { NumberSignPipe } from './selector/number-sign.pipe';
import { ClockDisplayComponent } from './clock-display/clock-display.component';
import { ClockOffsetComponent } from './clock-offset/clock-offset.component';
import { LaiksService } from './shared/laiks.service';
import { NpDataService } from './shared/np-data.service';
import { BehaviorSubject } from 'rxjs';
import { NpDataComponent } from './np-data/np-data.component';

class TestNpService {
  npData$ = new BehaviorSubject([]);
}



describe('AppComponent', () => {

  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {

    await TestBed.configureTestingModule({
      imports: [
        SharedModule,
      ],
      declarations: [
        AppComponent,
        SelectorComponent,
        NumberSignPipe,
        ClockDisplayComponent,
        ClockOffsetComponent,
        NpDataComponent,
      ],
      providers: [
        {
          provide: NpDataService,
          useClass: TestNpService,
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;


    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });


});
