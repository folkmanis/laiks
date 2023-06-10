import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplianceConsumptionComponent } from './appliance-consumption.component';

describe('ApplianceConsumptionComponent', () => {
  let component: ApplianceConsumptionComponent;
  let fixture: ComponentFixture<ApplianceConsumptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [ApplianceConsumptionComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(ApplianceConsumptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
