import { Pipe, PipeTransform } from '@angular/core';

type DateFormat = 'date' | 'datetime' | 'short';

@Pipe({
  name: 'dateFormat',
  standalone: true,
})
export class DateFormatPipe implements PipeTransform {
  transform(value: string, format: DateFormat = 'date'): string {
    const date = new Date(value);

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
