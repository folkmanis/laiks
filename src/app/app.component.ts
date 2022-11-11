import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Auth, authState, GoogleAuthProvider, signInWithPopup, signOut, User } from '@angular/fire/auth';
import { map, Observable, of, switchMap } from 'rxjs';
import { LaiksService } from './shared/laiks.service';
import { UserService } from './shared/user.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {

  currentTime$ = this.laiksService.minuteObserver();

  initialOffset: number = 1;

  user$: Observable<User | null> = this.userService.getUser();

  npAllowed$ = this.userService.isNpAllowed();

  constructor(
    private laiksService: LaiksService,
    private userService: UserService,
  ) { }

  ngOnInit(): void {
    this.initialOffset = this.laiksService.getSettings().offset;
  }

  onOffsetChange(offset: number) {
    this.laiksService.setSettings({ offset });
  }

  onLogin() {
    this.userService.login();
  }

  onLogout() {
    this.userService.logout();
  }

}
