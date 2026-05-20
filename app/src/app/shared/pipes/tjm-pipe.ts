import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tjm',
  standalone: true,
})
export class TjmPipe implements PipeTransform {
  transform(value: number): string {
    if (value == null) {
      return '';
    }

    const formattedValue = new Intl.NumberFormat('fr-FR').format(value);

    return `${formattedValue} €/jour`;
  }
}
