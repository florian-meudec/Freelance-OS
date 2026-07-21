import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fallback',

  standalone: true,
})
export class FallbackPipe implements PipeTransform {
  /*
    Display a shared placeholder whenever
    a value is missing or empty.
  */
  transform<T>(value: T | null | undefined, fallback = '-'): T | string {
    if (value === null || value === undefined || value === '') {
      return fallback;
    }

    return value;
  }
}
