import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteUserComponent } from './delete-user.component';
import { testFirebaseProvider } from '@shared/firebase/test-firebase-provider';
import { provideRouter } from '@angular/router';

describe('DeleteUserComponent', () => {
  let component: DeleteUserComponent;
  let fixture: ComponentFixture<DeleteUserComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DeleteUserComponent],
      providers: [
        testFirebaseProvider,
        provideRouter([{ path: '**', component: DeleteUserComponent }]),
      ],
    });
    fixture = TestBed.createComponent(DeleteUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
