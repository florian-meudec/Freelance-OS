import { Component, computed, input } from '@angular/core';
import { AbstractControl } from '@angular/forms';

import { VALIDATION_MESSAGES } from '../../constants/form-validation.constants';

@Component({
  selector: 'app-form-errors',

  standalone: true,

  templateUrl: './form-errors.html',

  styleUrl: './form-errors.scss',
})
export class FormErrors {
  readonly control = input.required<AbstractControl>();

  readonly errorMessage = computed(() => {
    const control = this.control();

    if (!(control.touched || control.dirty) || !control.errors) {
      return null;
    }

    const firstError = Object.entries(control.errors)[0];

    if (!firstError) {
      return null;
    }

    const [key, value] = firstError;

    const message = VALIDATION_MESSAGES[key];

    if (!message) {
      return 'Valeur invalide.';
    }

    return typeof message === 'function' ? message(value) : message;
  });
}
