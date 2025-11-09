import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { TitleAuthComponentComponent } from "../../components/title-auth-component/title-auth-component.component";
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ɵInternalFormsSharedModule, ReactiveFormsModule } from '@angular/forms';
import { GetErrorsAuthService } from '../../services/getErrors-auth.service';
import { AlertsAuthComponent } from "../../components/alerts-auth/alerts-auth.component";
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-register-page',
  imports: [TitleAuthComponentComponent, RouterLink, ɵInternalFormsSharedModule, ReactiveFormsModule, AlertsAuthComponent, CommonModule],
  templateUrl: './register-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterPageComponent {

  fb = inject(FormBuilder);
  validationService = inject(GetErrorsAuthService);

  hasError = signal(false);
  isPosting = signal(false);

  registerForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(50)]],
    surname: ['', [Validators.required, Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirm_password: ['', [Validators.required, Validators.minLength(8)]]
  })

  onSubmit() {
  if (this.registerForm.invalid) {
    this.hasError.set(true);
    setTimeout(() =>
      this.hasError.set(false)
    , 4000);
    return;
  }

    const { name ,email, surname ,password, confirm_password } = this.registerForm.value;

    console.log({name, surname , email, password, confirm_password });
  }

  isValidField(fieldName: string): boolean | null {
    return this.validationService.hasError(this.registerForm.controls[fieldName]);
  }

  getFieldErrors(fieldName: string): string | null {
    return this.validationService.getErrorMessage(this.registerForm.controls[fieldName]);
  }

 }
