import { TestBed } from '@angular/core/testing';
import { testFirebaseProvider } from "./test-firebase-provider";
import { FirebaseApp } from '@angular/fire/app';
import { Auth, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';
import { Functions } from '@angular/fire/functions';

const ADMIN_USER = {
    email: 'admin@example.com',
    password: '2393fgklsd@43KL',
};

export async function loginAdmin() {
    const { email, password } = ADMIN_USER;
    const auth = TestBed.inject(Auth);
    await signInWithEmailAndPassword(auth, email, password);
}

export function logout() {
    const auth = TestBed.inject(Auth);
    signOut(auth);
}

describe('testFirebaseProvider', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: testFirebaseProvider
        });
    });

    it('should provide firebase', () => {
        expect(TestBed.inject(FirebaseApp)).toBeTruthy();
    });

    it('should provide auth', () => {
        expect(TestBed.inject(Auth)).toBeTruthy();
    });

    it('should provide firestore', () => {
        expect(TestBed.inject(Firestore)).toBeTruthy();
    });

    it('should provide functions', () => {
        expect(TestBed.inject(Functions)).toBeTruthy();
    });
});