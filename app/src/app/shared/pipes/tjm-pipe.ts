import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tjm',
  standalone: true,
})
export class TjmPipe implements PipeTransform {
  /*
    Formats daily freelance rates using
    French number formatting conventions.
  */
  transform(value?: number): string {
    /*
      Missing values display the shared
      placeholder used across the application.
    */
    if (value == null) {
      return '-';
    }

    const formattedValue = new Intl.NumberFormat('fr-FR').format(value);

    return `${formattedValue} €/jour`;
  }
}
