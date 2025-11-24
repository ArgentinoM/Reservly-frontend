import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { TitleAuthComponentComponent } from "../../components/title-auth-component/title-auth-component.component";
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { GetErrorsAuthService } from '../../services/getErrors-auth.service';
import { CommonModule } from '@angular/common';
import { AlertsAuthComponent } from "../../components/alerts-auth/alerts-auth.component";
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register-page',
  imports: [
    TitleAuthComponentComponent,
    RouterLink,
    ReactiveFormsModule,
    CommonModule,
    AlertsAuthComponent
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
      this.showFormErrors();
      return;
    }

    const payload = this.registerForm.value;
    this.isPosting.set(true);

    this.authService.register(payload).subscribe((resp) =>{
      this.isPosting.set(false);

      if (resp) {
        this.registerForm.reset({ role: 'user' });

        setTimeout(() => {
          this.router.navigateByUrl('/auth/login');
        }, 1200);

        return;
      }

      this.pushError("No se pudo completar el registro");
    });
  }


  private showFormErrors() {
    const list: string[] = [];

    Object.keys(this.registerForm.controls).forEach(field => {
      const msg = this.getFieldErrors(field);
      if (msg) list.push(msg);
    });

    this.errors.set(list);
    this.autoClear();
  }

  private pushError(msg: string) {
    this.errors.update(prev => [...prev, msg]);
    this.autoClear();
  }

  private showSuccess(msg: string) {
    this.errors.set([msg]);
    this.autoClear();
  }

  private autoClear() {
    setTimeout(() => this.errors.set([]), 4000);
  }

  getFieldErrors(fieldName: string): string | null {
    return this.validationService.getErrorMessage(this.registerForm.controls[fieldName]);
  }
}
