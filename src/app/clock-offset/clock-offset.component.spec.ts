import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedModule } from '../lib/shared.module';
import { ClockOffsetComponent } from './clock-offset.component';
import { ClockDisplayComponent } from '../clock-display/clock-display.component';
import { SelectorComponent } from '../selector/selector.component';
import { NumberSignPipe } from '../selector/number-sign.pipe';

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
    expect(component.timeWithOffset).toEqual(TEST_TIME_OFFSET);
  });

});
