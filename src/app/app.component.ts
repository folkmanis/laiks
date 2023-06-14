import { AsyncPipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { User } from '@angular/fire/auth';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginResponseType, UserService } from './shared/user.service';
import { UserMenuComponent } from './user-menu/user-menu.component';
import { CdkScrollableModule } from '@angular/cdk/scrolling';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterOutlet,
    MatIconModule,
    MatToolbarModule,
    MatButtonModule,
    NgIf,
    AsyncPipe,
    UserMenuComponent,
    RouterLink,
    CdkScrollableModule,
  ]
})
export class AppComponent {


  user$: Observable<User | null> = this.userService.getUser();

  laiksUser$ = this.userService.laiksUser();

  isAdmin$ = this.userService.isAdmin();

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
