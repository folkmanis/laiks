import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PricesTableComponent } from './prices-table.component';

describe('PricesTableComponent', () => {
  let component: PricesTableComponent;
  let fixture: ComponentFixture<PricesTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PricesTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PricesTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
