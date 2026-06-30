import { Component, computed, forwardRef, input, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { SelectMenuOption } from '../../models/select-menu-option.model';

@Component({
  selector: 'app-select-menu',

  standalone: true,

  imports: [],

  templateUrl: './select-menu.html',

  styleUrl: './select-menu.scss',

  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectMenu),
      multi: true,
    },
  ],
})
export class SelectMenu implements ControlValueAccessor {
  readonly options = input.required<SelectMenuOption[]>();

  readonly opened = signal(false);

  private readonly value = signal('');

  readonly selectedValue = this.value.asReadonly();

  readonly placeholder = input('Sélectionner...');

  /*
    Display the label associated with
    the currently selected option.
  */
  readonly selectedLabel = computed(
    () =>
      this.options().find((option) => option.value === this.value())?.label ?? this.placeholder(),
  );

  private onChange: (value: string) => void = () => {};

  private onTouched: () => void = () => {};

  writeValue(value: string): void {
    this.value.set(value);
  }

  registerOnChange(onChange: (value: string) => void): void {
    this.onChange = onChange;
  }

  registerOnTouched(onTouched: () => void): void {
    this.onTouched = onTouched;
  }

  setDisabledState(_isDisabled: boolean): void {}

  toggle(): void {
    this.opened.update((value) => !value);
  }

  selectOption(value: string): void {
    this.value.set(value);

    this.onChange(value);

    this.onTouched();

    this.opened.set(false);
  }
}
