import { inject } from '@angular/core';
import { LoginService } from "./login.service";
import { toSignal } from '@angular/core/rxjs-interop';

export function isAdmin() {
    return toSignal(
        inject(LoginService).adminObserver(),
        { initialValue: false }
    );
} 