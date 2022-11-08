import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Auth, authState, GoogleAuthProvider, signInWithPopup, signOut, User } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { LaiksService } from './shared/laiks.service';


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

  constructor(
    private laiksService: LaiksService,
    private auth: Auth,
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

}
