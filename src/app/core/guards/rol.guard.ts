import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';

export const RolGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const requiredRol = route.data?.['rol'] as string;

  const user = authService.user();
  const userValue = user;

  if (!userValue || !userValue.rol?.name) {
    router.navigate(['/auth/login']);
    return false;
  }

  const hasRol = userValue.rol.name.includes(requiredRol);

  if (!hasRol) {
    router.navigate(['/']);
    return false;
  }

  return true;
};
