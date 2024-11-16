import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideTestFirebase } from '@shared/firebase/test-firebase-provider';
import { SystemPricesComponent } from './system-prices.component';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';
import { PriceCalculatorService } from '@shared/np-data/price-calculator.service';
import { NpDataService } from '@shared/np-data/np-data.service';

describe('SystemPricesComponent', () => {
  let component: SystemPricesComponent;
  let fixture: ComponentFixture<SystemPricesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SystemPricesComponent],
      providers: [
        provideTestFirebase(),
        provideExperimentalZonelessChangeDetection(),
        PriceCalculatorService,
        NpDataService,
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(SystemPricesComponent);
    await fixture.whenStable();
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
