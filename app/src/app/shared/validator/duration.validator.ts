import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function durationValidator(): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const durationValue = group.get('durationValue')?.value;
    const durationUnit = group.get('durationUnit')?.value;

    const hasValue = durationValue !== null && durationValue !== undefined;
    const hasUnit = durationUnit !== null && durationUnit !== '';

    return hasValue === hasUnit ? null : { invalidDuration: true };
  };
}
