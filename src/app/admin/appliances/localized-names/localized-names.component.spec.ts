import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalizedNamesComponent } from './localized-names.component';
import { provideRouter } from '@angular/router';
import { testFirebaseProvider } from '@shared/firebase/test-firebase-provider';

describe('LocalizedNamesComponent', () => {
  let component: LocalizedNamesComponent;
  let fixture: ComponentFixture<LocalizedNamesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LocalizedNamesComponent],
      providers: [
        provideRouter([{ path: '**', component: LocalizedNamesComponent }]),
        testFirebaseProvider,
      ],
    });
    fixture = TestBed.createComponent(LocalizedNamesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
