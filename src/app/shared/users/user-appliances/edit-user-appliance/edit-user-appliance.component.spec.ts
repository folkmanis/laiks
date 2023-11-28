import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditUserApplianceComponent } from './edit-user-appliance.component';
import { provideRouter } from '@angular/router';
import { testFirebaseProvider } from '@shared/firebase/test-firebase-provider';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('EditUserApplianceComponent', () => {
  let component: EditUserApplianceComponent;
  let fixture: ComponentFixture<EditUserApplianceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [EditUserApplianceComponent, NoopAnimationsModule],
      providers: [
        provideRouter([{ path: '**', component: EditUserApplianceComponent }]),
        testFirebaseProvider,
      ],
    });
    fixture = TestBed.createComponent(EditUserApplianceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
