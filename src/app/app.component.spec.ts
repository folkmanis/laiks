import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { SelectorComponent } from './selector/selector.component';
import { SharedModule } from './lib/shared.module';
import { NumberSignPipe } from './selector/number-sign.pipe';
import { ClockDisplayComponent } from './clock-display/clock-display.component';

const TEST_TIME = new Date(2022, 10, 23, 21, 15, 0);
const TEST_OFFSET = 3;
const TEST_TIME_OFFSET = new Date(2022, 10, 24, 0, 15, 0);

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
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;

    component.currentTime = TEST_TIME;

    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should set time with offset', () => {
    component.timeOffset = TEST_OFFSET;
    fixture.detectChanges();
    expect(component.timeWithOffset).toEqual(TEST_TIME_OFFSET);
  });
  /*   it('should render title', () => {
      const fixture = TestBed.createComponent(AppComponent);
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('.content span')?.textContent).toContain('Laiks app is running!');
    }); */
});
