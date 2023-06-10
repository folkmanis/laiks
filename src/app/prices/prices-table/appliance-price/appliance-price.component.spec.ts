import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppliancePriceComponent } from './appliance-price.component';

describe('AppliancePriceComponent', () => {
  let component: AppliancePriceComponent;
  let fixture: ComponentFixture<AppliancePriceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [AppliancePriceComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(AppliancePriceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
