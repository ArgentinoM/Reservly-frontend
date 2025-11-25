import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const normalized = {
        error: extractErrorMessage(error)
      };
      return throwError(() => normalized);
    })
  );
};

function extractErrorMessage(error: HttpErrorResponse): string {

  if (typeof error.error?.errors === 'string') {
    return error.error.errors;
  }


  if (typeof error.error?.errors === 'object') {
    const errors = error.error.errors;
    const firstKey = Object.keys(errors)[0];
    return errors[firstKey][0] ?? 'Error desconocido';
  }


  if (typeof error.error?.message === 'string') {
    return error.error.message;
  }

  return 'Ocurrió un error inesperado';
}
