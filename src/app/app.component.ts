import { CdkScrollableModule } from '@angular/cdk/scrolling';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { MarketZonesService } from '@shared/np-data';
import { LoginService, isAdmin, isNpAllowed } from '@shared/users';
import { map, of, switchMap } from 'rxjs';
import { UserMenuComponent } from './user-menu/user-menu.component';
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
    UserMenuComponent,
    RouterLink,
    CdkScrollableModule,
  ],
})
export class AppComponent {
  private loginService = inject(LoginService);
  private router = inject(Router);
  private zonesService = inject(MarketZonesService);

  private marketZone$ = this.loginService.laiksUser().pipe(
    map((user) => user?.marketZoneId),
    switchMap((id) =>
      id
        ? this.zonesService
          .getZoneFlow(id)
          .pipe(map((zone) => ({ ...zone, id })))
        : of(null)
    )
  );

  marketZone = toSignal(this.marketZone$);

  laiksUser = toSignal(this.loginService.laiksUser(), { initialValue: null });

  user = toSignal(this.loginService.getUser(), { initialValue: null });

  isAdmin = isAdmin();

  isNpAllowed = isNpAllowed();

  onLogout() {
    this.loginService.logout();
    this.router.navigateByUrl('/');
  }
}
