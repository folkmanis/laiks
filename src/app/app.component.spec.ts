import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { SelectorComponent } from './selector/selector.component';
import { SharedModule } from './lib/shared.module';
import { NumberSignPipe } from './selector/number-sign.pipe';
import { ClockDisplayComponent } from './clock-display/clock-display.component';

describe('AppComponent', () => {
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
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'Laiks'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('Laiks');
  });

  /*   it('should render title', () => {
      const fixture = TestBed.createComponent(AppComponent);
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('.content span')?.textContent).toContain('Laiks app is running!');
    }); */
});
