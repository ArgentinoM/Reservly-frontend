import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class GetErrorsAuthService {

  hasError(control: AbstractControl): boolean {
    return !!control.errors;
  }

  getErrorMessage(control: AbstractControl): string | null {
    if (!control.errors) return null;

    const errors: ValidationErrors = control.errors;

    console.log(errors);

    for (const key of Object.keys(errors)) {
      switch (key) {
        case 'email':
          return 'El email no es válido';
        case 'required':
          return `El campo es requerido`;
        case 'minlength':
          return `El campo debe contener al menos ${errors['minlength'].requiredLength} caracteres`;
        case 'maxlength':
          return `El campo debe contener como máximo ${errors['maxlength'].requiredLength} caracteres`;
      }
    }

    return null;
  }


}
