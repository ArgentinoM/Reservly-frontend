import { HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';


export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
  const authService = inject(AuthService);

  const newReq = req.clone({
    headers: req.headers.append('Authorization', `Bearer ${authService.token}`,),
  });

  return next(newReq);


}
