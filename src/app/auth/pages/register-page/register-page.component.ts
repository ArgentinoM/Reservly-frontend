import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NotificationsComponent } from "../../../shared/components/notifications/notifications.component";
import { TitleAuthComponentComponent } from "../../components/title-auth-component/title-auth-component.component";
import { AuthService } from '../../services/auth.service';
import { GetErrorsAuthService } from '../../services/getErrors-auth.service';

@Component({
  selector: 'app-register-page',
  imports: [
    TitleAuthComponentComponent,
    RouterLink,
    ReactiveFormsModule,
    CommonModule,
    NotificationsComponent
],
  templateUrl: './register-page.component.html',
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

  showPassword = signal(false);
  showConfirmPassword = signal(false);


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
        this.showAlert('success', resp.message)
      },
      error: ({error}) => {
        this.showAlert('error', error)
      }
    })
  }

  private showAlert(type: 'success' | 'error', message: string) {
    this.alertType = type;
    this.alertMessage.set(message);
    this.alertVisible.set(true);

    setTimeout(() => this.alertVisible.set(false), 5000);
  }

  toggleConfirmPassword() {
    this.showConfirmPassword.update(v => !v);
  }

  togglePassword() {
    this.showPassword.update(v => !v);
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
