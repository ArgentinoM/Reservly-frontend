import { Routes } from '@angular/router';
import { AuthLoyoutComponent } from './layout/auth-loyout/auth-loyout.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { RegisterPageComponent } from './pages/register-page/register-page.component';

export const authRoutes: Routes = [
  {
    path: '',
    component: AuthLoyoutComponent,
    children: [
      {
        path: 'login',
        component: LoginPageComponent
      },
      {
        path: 'register',
        component: RegisterPageComponent
      },
      {
        path: '**',
        redirectTo: 'login'
      },
    ]
  }
];

export default authRoutes;
