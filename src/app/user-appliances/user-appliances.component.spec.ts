import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAppliancesComponent } from './user-appliances.component';

describe('UserAppliancesComponent', () => {
  let component: UserAppliancesComponent;
  let fixture: ComponentFixture<UserAppliancesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [UserAppliancesComponent]
    });
    fixture = TestBed.createComponent(UserAppliancesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
