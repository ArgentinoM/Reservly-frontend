import { inject } from '@angular/core';
import { CanMatchFn, Route, Router, UrlSegment } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';

export const SellerGuard: CanMatchFn = async(
  route: Route,
  segments: UrlSegment[]
) => {

  const authService =  inject(AuthService);
  const router = inject(Router);

  const rol_id = authService.rolId;

  if(rol_id() !== 1){
    router.navigateByUrl('/');
    return false

  }

  return true;
}
