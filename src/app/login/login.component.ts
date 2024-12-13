import { A11yModule } from '@angular/cdk/a11y';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  input,
  viewChild,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router, RouterLink } from '@angular/router';
import { LoginResponseType, LoginService } from '@shared/users';

@Component({
    selector: 'laiks-login',
    imports: [
        MatSnackBarModule,
        MatButtonModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatDividerModule,
        MatInputModule,
        RouterLink,
        A11yModule,
    ],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {
  private snack = inject(MatSnackBar);
  private loginService = inject(LoginService);
  private router = inject(Router);
  private nnfb = new FormBuilder().nonNullable;
  private emailInput = viewChild<ElementRef<HTMLInputElement>>('emailInput');

  loginGroup = this.nnfb.group({
    email: ['', [Validators.email, Validators.required]],
    password: ['', [Validators.required]],
  });

  redirect = input<string>();

  async onLoginWithGmail() {
    try {
      const result = await this.loginService.loginWithGmail();
      if (result.type === LoginResponseType.CREATED) {
        this.snack.open(
          `Izveidots jauns lietotājs ${result.laiksUser.email}`,
          'OK',
        );
        this.router.navigate(['/', 'user-settings']);
        return;
      }
      if (result.type === LoginResponseType.EXISTING) {
        this.snack.open(`Pieslēgšanās veiksmīga`, 'OK', { duration: 5000 });
      }
      this.router.navigateByUrl(this.redirect() ?? '/');
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
      this.router.navigateByUrl(this.redirect() ?? '/');
    } catch (error) {
      this.snack.open(`Pieslēgšanās neveiksmīga. ${error}`, 'OK');
      this.loginGroup.controls.password.reset();
      this.emailInput()?.nativeElement.focus();
    }
  }
}
