import { TestBed } from '@angular/core/testing';

import { UsersAdminService } from './users-admin.service';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { environment } from 'src/environments/environment';

describe('UsersService', () => {
  let service: UsersAdminService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        provideFirebaseApp(() => initializeApp(environment.firebase)),
        provideAuth(() => getAuth()),
        provideFirestore(() => getFirestore())
      ]
    });
    service = TestBed.inject(UsersAdminService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});