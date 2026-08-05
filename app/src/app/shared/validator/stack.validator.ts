import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function stackValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (typeof value !== 'string' || value.trim() === '') {
      return null;
    }

    const rawTechnologies = value.split(',');

    if (rawTechnologies.some((technology) => technology.trim().length === 0)) {
      return { emptyTechnology: true };
    }

    const technologies = rawTechnologies.map((technology) => technology.trim());

    const normalized = technologies.map((technology) => technology.toLowerCase());

    if (new Set(normalized).size !== normalized.length) {
      return { duplicateTechnology: true };
    }

    if (technologies.some((technology) => technology.length > 100)) {
      return { technologyTooLong: true };
    }

    return null;
  };
}
