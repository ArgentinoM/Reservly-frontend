import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { TitleAuthComponentComponent } from "../../components/title-auth-component/title-auth-component.component";
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { GetErrorsAuthService } from '../../services/getErrors-auth.service';
import { CommonModule } from '@angular/common';
import { AlertsAuthComponent } from "../../components/alerts-auth/alerts-auth.component";
import { AuthService } from '../../services/auth.service';
import { NotificationsComponent } from "../../../shared/components/notifications/notifications.component";

@Component({
  selector: 'app-register-page',
  imports: [
    TitleAuthComponentComponent,
    RouterLink,
    ReactiveFormsModule,
    CommonModule,
    AlertsAuthComponent,
    NotificationsComponent
],
  templateUrl: './register-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterPageComponent {

  fb = inject(FormBuilder);
  validationService = inject(GetErrorsAuthService);
  router = inject(Router);
  authService = inject(AuthService);

  errors = signal<string[]>([]);
  isPosting = signal(false);
  alertVisible = signal(false);
  alertType: 'success' | 'error' = 'success';
  alertMessage = signal('');

  registerForm: FormGroup = this.fb.group({
    role: ['user', [Validators.required]],
    name: ['', [Validators.required, Validators.maxLength(50)]],
    surname: ['', [Validators.required, Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirm_password: ['', [Validators.required, Validators.minLength(8)]]
  });

  onSubmit() {
    if (this.registerForm.invalid) {
      this.showFormError();
      return;
    }

    const payload = this.registerForm.value;
    this.isPosting.set(true);

    this.authService.register(payload).subscribe({
      next: (resp) => {
        this.isPosting.set(false);

        if (resp) {
          this.showAlert('success', 'Cuenta creada correctamente');

          this.registerForm.reset({ role: 'user' });

          setTimeout(() =>
            this.router.navigateByUrl('/auth/login')
          , 1200);

        } else {
          this.showAlert('error', 'No se pudo completar el registro');
        }
      },
      error: (err: any) => {
        this.isPosting.set(false);

        this.showAlert('error', err.error);
      }
    });
  }

  private showAlert(type: 'success' | 'error', message: string) {
    this.alertType = type;
    this.alertMessage.set(message);
    this.alertVisible.set(true);

    setTimeout(() => this.alertVisible.set(false), 5000);
  }


  private showFormError() {
    for (const field of Object.keys(this.registerForm.controls)) {
      const msg = this.getFieldErrors(field);

      if (msg) {
        const prettyField = field.charAt(0).toUpperCase() + field.slice(1);
        this.showAlert('error', `${prettyField}: ${msg}`);
        break;
      }

    }
  }

  getFieldErrors(fieldName: string): string | null {
    return this.validationService.getErrorMessage(this.registerForm.controls[fieldName]);
  }
}
