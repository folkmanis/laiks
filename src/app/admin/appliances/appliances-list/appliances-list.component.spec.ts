import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppliancesListComponent } from './appliances-list.component';

describe('AppliancesComponent', () => {
  let component: AppliancesListComponent;
  let fixture: ComponentFixture<AppliancesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [AppliancesListComponent]
})
      .compileComponents();

    fixture = TestBed.createComponent(AppliancesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
