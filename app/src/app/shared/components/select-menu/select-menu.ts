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
  /*
    Available options exposed by
    the parent component.
  */
  readonly options = input.required<SelectMenuOption[]>();

  /*
    Controls the dropdown visibility.
  */
  readonly opened = signal(false);

  private readonly value = signal('');

  /*
    Expose the current selection
    as a readonly signal.
  */
  readonly selectedValue = this.value.asReadonly();

  /*
    Displayed when no option
    has been selected.
  */
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

  /*
    Synchronize the component with
    the external form value.
  */
  writeValue(value: string): void {
    this.value.set(value);
  }

  /*
    Register the callback invoked
    when the value changes.
  */
  registerOnChange(onChange: (value: string) => void): void {
    this.onChange = onChange;
  }

  /*
    Register the callback invoked
    when the control is touched.
  */
  registerOnTouched(onTouched: () => void): void {
    this.onTouched = onTouched;
  }

  /*
    Reserved for future disabled
    state support.
  */
  setDisabledState(_isDisabled: boolean): void {}

  /*
    Toggle the dropdown visibility.
  */
  toggle(): void {
    this.opened.update((value) => !value);
  }

  /*
    Select an option and notify
    the Angular form control.
  */
  selectOption(value: string): void {
    this.value.set(value);

    this.onChange(value);

    this.onTouched();

    this.opened.set(false);
  }
}
