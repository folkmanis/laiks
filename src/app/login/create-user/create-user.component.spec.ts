import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateUserComponent } from './create-user.component';

import { provideTestFirebase } from '@shared/firebase/test-firebase-provider';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';

describe('CreateUserComponent', () => {
  let component: CreateUserComponent;
  let fixture: ComponentFixture<CreateUserComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [CreateUserComponent, NoopAnimationsModule],
      providers: [
        provideTestFirebase(),
        provideExperimentalZonelessChangeDetection(),
      ],
    });
    fixture = TestBed.createComponent(CreateUserComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
