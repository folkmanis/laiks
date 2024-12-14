import { Auth, onAuthStateChanged, User } from 'firebase/auth';
import { Observable } from 'rxjs';

export function authState(auth: Auth): Observable<User | null> {
  return new Observable((subscriber) =>
    onAuthStateChanged(
      auth,
      (user) => subscriber.next(user),
      (err) => subscriber.error(err),
      () => subscriber.complete(),
    ),
  );
}
