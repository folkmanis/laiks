import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedModule } from '../lib/shared.module';
import { ClockOffsetComponent } from './clock-offset.component';
import { ClockDisplayComponent } from '../clock-display/clock-display.component';
import { SelectorComponent } from '../selector/selector.component';
import { NumberSignPipe } from '../selector/number-sign.pipe';
import { addMinutes } from 'date-fns';

const TEST_TIME = new Date(2022, 10, 23, 21, 15, 0);
const TEST_OFFSET = 3;
const TEST_TIME_OFFSET = new Date(2022, 10, 24, 0, 15, 0);


describe('ClockOffsetComponent', () => {
  let component: ClockOffsetComponent;
  let fixture: ComponentFixture<ClockOffsetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        SharedModule,
      ],
      declarations: [
        ClockOffsetComponent,
        SelectorComponent,
        NumberSignPipe,
        ClockDisplayComponent,
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ClockOffsetComponent);
    component = fixture.componentInstance;

    component.currentTime = TEST_TIME;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set time with offset', () => {
    component.offset = TEST_OFFSET;
    fixture.detectChanges();
    expect(+component.timeWithOffset).toBe(+TEST_TIME_OFFSET);
  });

  it('should update time with current time updates', () => {
    component.offset = TEST_OFFSET;
    component.currentTime = addMinutes(TEST_TIME, 1);
    fixture.detectChanges();
    expect(+component.timeWithOffset).toBe(+addMinutes(TEST_TIME_OFFSET, 1));
  });

  it('should ignore null for currentTime', () => {
    const time = component.currentTime;
    component.currentTime = null;
    expect(component.currentTime).toBe(time);
  });

  it('should emit offset changes', () => {
    component.offsetChange.subscribe(offset => {
      expect(offset).toBe(TEST_OFFSET);
    });
    component.offset = TEST_OFFSET;
  });

});
