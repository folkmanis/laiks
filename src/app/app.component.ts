import { CdkScrollableModule } from '@angular/cdk/scrolling';
import { AsyncPipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { MarketZonesService } from '@shared/np-data';
import { LoginService } from '@shared/users';
import { map, of, switchMap } from 'rxjs';
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
    AsyncPipe,
    UserMenuComponent,
    RouterLink,
    CdkScrollableModule,
  ],
})
export class AppComponent {
  private loginService = inject(LoginService);
  private router = inject(Router);
  private zonesService = inject(MarketZonesService);

  laiksUser$ = this.loginService.laiksUser();

  user$ = this.loginService.getUser();

  isAdmin$ = this.loginService.isAdmin();

  isNpAllowed$ = this.loginService.isNpAllowed();

  marketZone$ = this.laiksUser$.pipe(
    map((user) => user?.marketZoneId),
    switchMap((id) =>
      id
        ? this.zonesService
            .getZoneFlow(id)
            .pipe(map((zone) => ({ ...zone, id })))
        : of(null)
    )
  );

  onLogout() {
    this.loginService.logout();
    this.router.navigateByUrl('/');
  }
}
