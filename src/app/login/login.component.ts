import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { LoginResponseType, LoginService } from '@shared/users';

@Component({
  selector: 'laiks-login',
  standalone: true,
  imports: [
    MatSnackBarModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatDividerModule,
    MatInputModule,
    RouterLink,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  private snack = inject(MatSnackBar);
  private loginService = inject(LoginService);
  private router = inject(Router);
  private redirect =
    inject(ActivatedRoute).snapshot.queryParamMap.get('redirect');
  private nnfb = new FormBuilder().nonNullable;

  loginGroup = this.nnfb.group({
    email: ['', [Validators.email, Validators.required]],
    password: ['', [Validators.required]],
  });

  async onLoginWithGmail() {
    try {
      const result = await this.loginService.loginWithGmail();
      if (result.type === LoginResponseType.CREATED) {
        this.snack.open(
          `Izveidots jauns lietotājs ${result.laiksUser.email}`,
          'OK'
        );
        this.router.navigate(['/', 'user-settings']);
        return;
      }
      if (result.type === LoginResponseType.EXISTING) {
        this.snack.open(`Pieslēgšanās veiksmīga`, 'OK', { duration: 5000 });
      }
      this.router.navigateByUrl(this.redirect ?? '/');

    } catch (err) {
      this.snack.open(`Neizdevās pieslēgties. ${err}`, 'OK');
      this.loginService.logout();
    }
  }

  async onLoginWithEmail(event: SubmitEvent) {

    event.preventDefault();
    const { email, password } = this.loginGroup.getRawValue();

    try {
      await this.loginService.loginWithEmail(email, password);

      this.snack.open(`Pieslēgšanās veiksmīga`, 'OK', { duration: 5000 });
      this.router.navigateByUrl(this.redirect ?? '/');

    } catch (error) {
      this.snack.open(`Pieslēgšanās neveiksmīga. ${error}`, 'OK');
      this.loginGroup.controls.password.reset();
    }

  }
}
