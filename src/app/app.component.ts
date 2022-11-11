import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { User } from '@angular/fire/auth';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { LaiksService } from './shared/laiks.service';
import { LoginResponseType, UserService } from './shared/user.service';


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

  npAllowed$ = this.userService.isNpAllowed(this.user$);

  constructor(
    private laiksService: LaiksService,
    private userService: UserService,
    private snack: MatSnackBar,
  ) { }

  ngOnInit(): void {
    this.initialOffset = this.laiksService.getSettings().offset;
  }

  onOffsetChange(offset: number) {
    this.laiksService.setSettings({ offset });
  }

  onLogin() {
    this.userService.login().subscribe({
      error: (err) => {
        this.snack.open(`Neizdevās pieslēgties. ${err}`, 'OK');
        this.userService.logout();
      },
      next: (resp) => {
        if (resp.type === LoginResponseType.CREATED) {
          this.snack.open(`Izveidots jauns lietotājs ${resp.laiksUser.email}`, 'OK');
        }
        if (resp.type === LoginResponseType.EXISTING) {
          this.snack.open(`Pieslēgšanās veiksmīga`, 'OK', { duration: 5000 });
        }
      }
    });
  }

  onLogout() {
    this.userService.logout();
  }

}
