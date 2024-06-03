import { TestBed } from '@angular/core/testing';
import { testFirebaseProvider } from "./test-firebase-provider";
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { Auth, FirebaseApp, Firestore, Functions } from "@shared/firebase";
import { provideExperimentalZonelessChangeDetection } from '@angular/core';

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
            providers: [testFirebaseProvider, provideExperimentalZonelessChangeDetection(),]
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