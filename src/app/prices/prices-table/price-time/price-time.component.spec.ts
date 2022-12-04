import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PriceTimeComponent } from './price-time.component';

describe('PriceTimeComponent', () => {
  let component: PriceTimeComponent;
  let fixture: ComponentFixture<PriceTimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PriceTimeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PriceTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
