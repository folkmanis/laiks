import { CdkScrollableModule } from '@angular/cdk/scrolling';
import { AsyncPipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { User } from '@angular/fire/auth';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import {
  DEFAULT_PERMISSIONS,
  LoginResponseType,
  LoginService,
  PermissionsService,
  MarketZonesService,
} from '@shared';
import { Observable, map, of, switchMap } from 'rxjs';
import { UserMenuComponent } from './user-menu/user-menu.component';

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
    UserMenuComponent,
    RouterLink,
    CdkScrollableModule,
  ],
})
export class AppComponent {
  private zonesService = inject(MarketZonesService);
  private laiksUser$ = this.loginService.laiksUser();

  user = toSignal(this.loginService.getUser(), { initialValue: null });

  laiksUser = toSignal(this.laiksUser$, { initialValue: null });

  isAdmin = toSignal(this.loginService.isAdmin());

  isNpAllowed = toSignal(this.loginService.isNpAllowed());

  private marketZone$ = this.laiksUser$.pipe(
    map((user) => user?.marketZoneId),
    switchMap((id) =>
      id
        ? this.zonesService
            .getZoneFlow(id)
            .pipe(map((zone) => ({ ...zone, id })))
        : of(null)
    )
  );
  marketZone = toSignal(this.marketZone$, { initialValue: null });

  constructor(
    private loginService: LoginService,
    private snack: MatSnackBar,
    private router: Router
  ) {}

  onLogin() {
    this.loginService.login().subscribe({
      error: (err) => {
        this.snack.open(`Neizdevās pieslēgties. ${err}`, 'OK');
        this.loginService.logout();
      },
      next: (resp) => {
        if (resp.type === LoginResponseType.CREATED) {
          this.snack.open(
            `Izveidots jauns lietotājs ${resp.laiksUser.email}`,
            'OK'
          );
        }
        if (resp.type === LoginResponseType.EXISTING) {
          this.snack.open(`Pieslēgšanās veiksmīga`, 'OK', { duration: 5000 });
        }
      },
    });
  }

  onLogout() {
    this.loginService.logout();
    this.router.navigateByUrl('/');
  }
}
