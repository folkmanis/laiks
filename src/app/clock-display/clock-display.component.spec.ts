import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClockDisplayComponent } from './clock-display.component';

const TEST_DATE = new Date(2022, 10, 20, 12, 3, 0);
const TEST_TIME_STR = '12:03';

describe('ClockDisplayComponent', () => {
  let component: ClockDisplayComponent;
  let fixture: ComponentFixture<ClockDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ClockDisplayComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ClockDisplayComponent);
    component = fixture.componentInstance;

    component.time = TEST_DATE;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display time', () => {
    const { textContent } = fixture.nativeElement.querySelector('.container') as HTMLDivElement;
    expect(textContent).toBe(TEST_TIME_STR);
  });
});
