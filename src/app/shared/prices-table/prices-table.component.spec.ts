import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PricesTableComponent } from './prices-table.component';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';

describe('PricesTableComponent', () => {
  let component: PricesTableComponent;
  let fixture: ComponentFixture<PricesTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PricesTableComponent],
      providers: [provideExperimentalZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(PricesTableComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
