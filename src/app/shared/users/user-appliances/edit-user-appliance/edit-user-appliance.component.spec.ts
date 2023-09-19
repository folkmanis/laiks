import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditUserApplianceComponent } from './edit-user-appliance.component';

describe('EditUserApplianceComponent', () => {
  let component: EditUserApplianceComponent;
  let fixture: ComponentFixture<EditUserApplianceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [EditUserApplianceComponent]
    });
    fixture = TestBed.createComponent(EditUserApplianceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
