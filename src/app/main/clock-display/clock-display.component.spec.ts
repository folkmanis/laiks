import { ComponentFixture, TestBed } from '@angular/core/testing';

import {
  Component,
  provideExperimentalZonelessChangeDetection,
} from '@angular/core';
import { ClockDisplayComponent } from './clock-display.component';

const TEST_DATE = new Date(2022, 10, 20, 12, 3, 0);
const TEST_TIME_STR = '12:03';

@Component({
  standalone: true,
  template: `<laiks-clock-display [time]="testDate" />`,
  imports: [ClockDisplayComponent],
})
class ClockDisplayTestComponent {
  testDate = TEST_DATE;
}

describe('ClockDisplayComponent', () => {
  let component: ClockDisplayTestComponent;
  let fixture: ComponentFixture<ClockDisplayTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClockDisplayTestComponent],
      providers: [provideExperimentalZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(ClockDisplayTestComponent);
    component = fixture.componentInstance;

    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display time', () => {
    const { textContent } = fixture.nativeElement.querySelector(
      'laiks-clock-display',
    ) as HTMLElement;
    expect(textContent).toBe(TEST_TIME_STR);
  });
});
