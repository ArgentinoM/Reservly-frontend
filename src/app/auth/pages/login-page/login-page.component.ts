import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { TitleAuthComponentComponent } from "../../components/title-auth-component/title-auth-component.component";
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { Router, RouterLink } from '@angular/router';
import { AlertsAuthComponent } from '../../components/alerts-auth/alerts-auth.component';
import { GetErrorsAuthService } from '../../services/getErrors-auth.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login-page',
  imports: [TitleAuthComponentComponent, RouterLink, ReactiveFormsModule, AlertsAuthComponent],
  templateUrl: './login-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPageComponent{
  fb = inject(FormBuilder);
  validationService = inject(GetErrorsAuthService);
  authService = inject(AuthService);
  router = inject(Router);

  hasError = signal(false);
  isPosting = signal(false);

  // rol_id = this.authService.rolId

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  onSubmit() {
    if (this.loginForm.invalid) {
      this.hasError.set(true);
      setTimeout(() =>
        this.hasError.set(false)
      , 4000);
      return;
    }

    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe((isAuthenticated) => {
      if(isAuthenticated){
        // if(this.rol_id() === 1){
        //   this.router.navigateByUrl('/seller');
        // }

        // if(this.rol_id() === 2){
        //   this.router.navigateByUrl('/');
        // }

        this.router.navigateByUrl('/');
        return;
      }

      this.hasError.set(true);
      setTimeout(() =>
        this.hasError.set(false)
      , 4000);
      return;
    });
  }

  isValidField(fieldName: string): boolean | null {
    return this.validationService.hasError(this.loginForm.controls[fieldName]);
  }

  getFieldErrors(fieldName: string): string | null {
    return this.validationService.getErrorMessage(this.loginForm.controls[fieldName]);
  }
 }
