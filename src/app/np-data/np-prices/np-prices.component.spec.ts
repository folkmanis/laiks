import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NpPricesComponent } from './np-prices.component';

describe('NpPricesComponent', () => {
  let component: NpPricesComponent;
  let fixture: ComponentFixture<NpPricesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NpPricesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NpPricesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
