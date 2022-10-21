import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { SelectorComponent } from './selector/selector.component';
import { SharedModule } from './lib/shared.module';
import { NumberSignPipe } from './selector/number-sign.pipe';
import { ClockDisplayComponent } from './clock-display/clock-display.component';
import { ClockOffsetComponent } from './clock-offset/clock-offset.component';
import { LaiksService } from './lib/laiks.service';

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
      ],
      providers: [
        LaiksService,
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
