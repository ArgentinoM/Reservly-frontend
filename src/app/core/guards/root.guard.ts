import { CanMatchFn, Router } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';
import { inject } from '@angular/core';

export const rootGuard: CanMatchFn = (route, segments) => {

  const authService = inject(AuthService);
  const router = inject(Router);

  const isAuthenticated = authService.isLoggedInLocal();

  if (isAuthenticated) {
    if (authService.isSeller()) {
      router.navigateByUrl('/seller');
    } else {
      router.navigateByUrl('/customer');
    }
    return false;
  }

  return true;
};
