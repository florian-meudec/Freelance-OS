import { Pipe, PipeTransform } from '@angular/core';

/*
  Supported display formats used across the application UI.
*/
type DateFormat = 'date' | 'datetime' | 'short';

@Pipe({
  name: 'dateFormat',
  standalone: true,
})
export class DateFormatPipe implements PipeTransform {
  /*
    Centralizes date formatting to keep
    localization and display consistency unified.
  */
  transform(value: string, format: DateFormat = 'date'): string {
    const date = new Date(value);

    /*
      Invalid dates return an empty string
      to avoid rendering broken UI values.
    */
    if (Number.isNaN(date.getTime())) {
      return '';
    }

    switch (format) {
      case 'datetime':
        return date.toLocaleString('fr-FR');

      case 'short':
        return date.toLocaleDateString('fr-FR', {
          day: 'numeric',
          month: 'short',
        });

      case 'date':
      default:
        return date.toLocaleDateString('fr-FR');
    }
  }
}
