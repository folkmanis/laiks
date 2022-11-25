import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '@angular/fire/auth';
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar';
import { Observable } from 'rxjs';
import { LoginResponseType, UserService } from './shared/user.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {


  user$: Observable<User | null> = this.userService.getUser();

  laiksUser$ = this.userService.laiksUser();


  constructor(
    private userService: UserService,
    private snack: MatSnackBar,
    private router: Router,
  ) { }

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
    this.router.navigateByUrl('/');
  }

}
