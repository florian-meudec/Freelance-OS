import { Component, computed, input, output, signal } from '@angular/core';
import { SelectMenuOption } from '../../models/select-menu-option.model';

@Component({
  selector: 'app-select-menu',

  standalone: true,

  imports: [],

  templateUrl: './select-menu.html',

  styleUrl: './select-menu.scss',
})
export class SelectMenu {
  readonly options = input.required<SelectMenuOption[]>();

  readonly selected = input.required<string>();

  readonly selectionChange = output<string>();

  readonly opened = signal(false);

  /*
    Display the label associated with
    the currently selected option.
  */
  readonly selectedLabel = computed(
    () => this.options().find((option) => option.value === this.selected())?.label ?? '',
  );

  toggle(): void {
    this.opened.update((value) => !value);
  }

  selectOption(value: string): void {
    this.selectionChange.emit(value);

    this.opened.set(false);
  }
}
