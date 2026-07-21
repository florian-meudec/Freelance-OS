import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-search-input',

  standalone: true,

  templateUrl: './search-input.html',

  styleUrl: './search-input.scss',
})
export class SearchInput {
  /*
    Current search query displayed
    by the input component.
  */
  readonly value = input('');

  /*
    Placeholder guides users when
    no search query is entered.
  */
  readonly placeholder = input('Rechercher...');

  /*
    Emit search updates so filtering
    remains controlled by the parent.
  */
  readonly valueChange = output<string>();

  /*
    Forward user input to the parent
    through the component output.
  */
  updateValue(value: string): void {
    this.valueChange.emit(value);
  }
}
