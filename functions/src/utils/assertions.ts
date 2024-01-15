import { HttpsError } from 'firebase-functions/v2/https';
import { AuthData } from 'firebase-functions/v2/tasks';

export function assertIsString(
  val: unknown,
  message: string = 'val'
): asserts val is string {
  if (typeof val !== 'string') {
    throw new HttpsError(
      'invalid-argument',
      `Expected '${message}' to be defined, but received '${val}'`
    );
  }
}

export function assertIsDefined<T>(
  val: T,
  message: string = 'val'
): asserts val is NonNullable<T> {
  if (val === undefined || val === null) {
    throw new HttpsError(
      'invalid-argument',
      `Expected '${message}' to be defined, but received '${val}'`
    );
  }
}

export function checkAuthStatus(
  auth: AuthData | undefined
): asserts auth is AuthData {
  if (!auth) {
    throw new HttpsError('unauthenticated', 'Not authenticated');
  }
}
