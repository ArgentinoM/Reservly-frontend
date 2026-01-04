import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Injectable({providedIn: 'root'})

export class FormErrorService  {

  getErrorMessage(
    controls: Record<string, AbstractControl>,
    messages: Record<string, Record<string, string>>
  ): string {

    for (const field in controls) {
      const control = controls[field];

      if (control?.errors) {
        const errorKey = Object.keys(control.errors)[0];
        return messages[field]?.[errorKey] ?? 'Campo inválido';
      }
    }

    return 'Formulario inválido';
  }

}
