import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function notBlank(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (value == null) {
      return null;
    }

    return typeof value === 'string' && value.trim().length === 0 ? { blank: true } : null;
  };
}
