/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */
import { EnvironmentProviders, Injector, makeEnvironmentProviders } from '@angular/core';
import { FirebaseApp as IFirebaseApp } from "firebase/app";
import { Auth as IAuth } from "firebase/auth";
import { Firestore as IFirestore } from "firebase/firestore";
import { Functions as IFunctions } from "firebase/functions";

export interface FirebaseApp extends IFirebaseApp { }

export class FirebaseApp {
    constructor(app: IFirebaseApp) {
        return app;
    }
}

export function provideFirebaseApp(fn: (injector: Injector) => IFirebaseApp): EnvironmentProviders {
    return makeEnvironmentProviders([
        {
            provide: FirebaseApp,
            useFactory: (injector: Injector) => {
                const app = fn(injector);
                return new FirebaseApp(app);
            },
            deps: [Injector]
        },

    ]);
}

export interface Auth extends IAuth { }

export class Auth {
    constructor(auth: IAuth) {
        return auth;
    }
}

export function provideAuth(fn: (injector: Injector) => IAuth): EnvironmentProviders {
    return makeEnvironmentProviders([
        {
            provide: Auth,
            useFactory: (injector: Injector) => {
                const auth = fn(injector);
                return new Auth(auth);
            },
            deps: [Injector, FirebaseApp]
        }
    ]);
}

export interface Firestore extends IFirestore { }

export class Firestore {
    constructor(firestore: IFirestore) {
        return firestore;
    }
}

export function provideFirestore(fn: (injector: Injector) => IFirestore): EnvironmentProviders {
    return makeEnvironmentProviders([
        {
            provide: Firestore,
            useFactory: (injector: Injector) => {
                const firestore = fn(injector);
                return new Firestore(firestore);
            },
            deps: [Injector, FirebaseApp]
        }
    ]);
}

export interface Functions extends IFunctions { }

export class Functions {
    constructor(functions: IFunctions) {
        return functions;
    }
}

export function provideFunctions(fn: (injector: Injector) => IFunctions): EnvironmentProviders {
    return makeEnvironmentProviders([
        {
            provide: Functions,
            useFactory: (injector: Injector) => {
                const functions = fn(injector);
                return new Functions(functions);
            },
            deps: [Injector, FirebaseApp]
        }
    ]);
}