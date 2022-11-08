import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Auth, authState, GoogleAuthProvider, signInWithPopup, signOut, User } from '@angular/fire/auth';
import { map, Observable, of, switchMap } from 'rxjs';
import { LaiksService } from './shared/laiks.service';
import { collection, collectionData, doc, DocumentData, DocumentSnapshot, Firestore, onSnapshot, Timestamp, query, where, docData } from '@angular/fire/firestore';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {

  currentTime$ = this.laiksService.minuteObserver();

  initialOffset: number = 1;

  user$: Observable<User | null> = authState(this.auth);

  npAllowed$ = authState(this.auth).pipe(
    switchMap(usr => this.isNpAllowed(usr))
  );

  constructor(
    private laiksService: LaiksService,
    private auth: Auth,
    private firestore: Firestore,
  ) { }

  ngOnInit(): void {
    this.initialOffset = this.laiksService.getSettings().offset;
  }

  onOffsetChange(offset: number) {
    this.laiksService.setSettings({ offset });
  }

  onLogin() {
    signInWithPopup(this.auth, new GoogleAuthProvider());
  }

  onLogout() {
    signOut(this.auth);
  }

  private isNpAllowed(usr: User | null): Observable<boolean> {
    if (!usr || !usr.email) {
      return of(false);
    }

    const docRef = doc(this.firestore, 'users', usr.email);

    return docData(docRef).pipe(
      map(d => d && d['npAllowed'] === true)
    );

  }

}
