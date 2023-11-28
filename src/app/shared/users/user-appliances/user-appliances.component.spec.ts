import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAppliancesComponent } from './user-appliances.component';
import { testFirebaseProvider } from '@shared/firebase/test-firebase-provider';
import { provideRouter } from '@angular/router';

describe('UserAppliancesComponent', () => {
  let component: UserAppliancesComponent;
  let fixture: ComponentFixture<UserAppliancesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [UserAppliancesComponent],
      providers: [
        provideRouter([{ path: '**', component: UserAppliancesComponent }]),
        testFirebaseProvider,
      ],
    });
    fixture = TestBed.createComponent(UserAppliancesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
