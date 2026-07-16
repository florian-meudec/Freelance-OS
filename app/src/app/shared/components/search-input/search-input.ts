import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-search-input',

  standalone: true,

  templateUrl: './search-input.html',

  styleUrl: './search-input.scss',
})
export class SearchInput {
  readonly value = input('');

  readonly placeholder = input('Rechercher...');

  readonly valueChange = output<string>();

  updateValue(value: string): void {
    this.valueChange.emit(value);
  }
}
