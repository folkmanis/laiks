import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSettingsComponent } from './user-settings.component';
import { provideRouter } from '@angular/router';
import { testFirebaseProvider } from '@shared/firebase/test-firebase-provider';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('UserSettingsComponent', () => {
  let component: UserSettingsComponent;
  let fixture: ComponentFixture<UserSettingsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [UserSettingsComponent, NoopAnimationsModule],
      providers: [
        provideRouter([{ path: '**', component: UserSettingsComponent }]),
        testFirebaseProvider,
      ],
    });
    fixture = TestBed.createComponent(UserSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
