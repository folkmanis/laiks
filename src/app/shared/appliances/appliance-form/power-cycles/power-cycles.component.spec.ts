import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PowerCyclesComponent } from './power-cycles.component';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';

describe('PowerCyclesComponent', () => {
  let component: PowerCyclesComponent;
  let fixture: ComponentFixture<PowerCyclesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PowerCyclesComponent],
      providers: [provideExperimentalZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(PowerCyclesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
