import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { TitleAuthComponentComponent } from "../../components/title-auth-component/title-auth-component.component";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AlertsAuthComponent } from '../../components/alerts-auth/alerts-auth.component';
import { GetErrorsAuthService } from '../../services/getErrors-auth.service';
import { AuthService } from '../../services/auth.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-login-page',
  imports: [
    TitleAuthComponentComponent,
    RouterLink,
    ReactiveFormsModule,
    AlertsAuthComponent
  ],
  templateUrl: './login-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPageComponent {

  private fb = inject(FormBuilder);
  private validationService = inject(GetErrorsAuthService);
  private authService = inject(AuthService);
  private router = inject(Router);


  errors = signal<string[]>([]);
  isPosting = signal(false);


  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });


  async onSubmit() {
    if (this.loginForm.invalid) {
      this.showFormErrors();
      return;
    }

    this.isPosting.set(true);

    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe(async (isAuthenticated) => {
      this.isPosting.set(false);

      if (isAuthenticated) {
        await this.redirectUser();
        return;
      }

      this.pushError('Correo o contraseña incorrectos');
    });
  }

  private async redirectUser() {
    await firstValueFrom(this.authService.checkStatus());

    if (this.authService.isSeller()) {
      this.router.navigateByUrl('seller');
    } else {
      this.router.navigateByUrl('customer');
    }
  }


  private showFormErrors() {
    const newErrors: string[] = [];

    Object.keys(this.loginForm.controls).forEach((field) => {
      const msg = this.getFieldErrors(field);
      if (msg) newErrors.push(msg);
    });

    this.errors.set(newErrors);
    this.autoClearErrors();
  }

  private pushError(message: string) {
    this.errors.update((prev) => [...prev, message]);
    this.autoClearErrors();
  }

  private autoClearErrors() {
    setTimeout(() => this.errors.set([]), 4000);
  }


  isValidField(fieldName: string): boolean {
    const control = this.loginForm.get(fieldName);
    if (!control) return false;
    return this.validationService.hasError(control);
  }

  getFieldErrors(fieldName: string): string {
    const control = this.loginForm.get(fieldName);
    if (!control) return '';
    return this.validationService.getErrorMessage(control) ?? '';
  }
}
