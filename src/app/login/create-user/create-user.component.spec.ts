import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateUserComponent } from './create-user.component';

import { testFirebaseProvider } from '@shared/firebase/test-firebase-provider';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('CreateUserComponent', () => {
  let component: CreateUserComponent;
  let fixture: ComponentFixture<CreateUserComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CreateUserComponent, NoopAnimationsModule],
      providers: [testFirebaseProvider],
    });
    fixture = TestBed.createComponent(CreateUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
