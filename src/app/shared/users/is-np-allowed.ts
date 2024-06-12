import { inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { LoginService } from './login.service';

export function isNpAllowed() {
  return toSignal(inject(LoginService).npAllowedObserver(), {
    initialValue: true,
  });
}
