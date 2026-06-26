import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fallback',

  standalone: true,
})
export class FallbackPipe implements PipeTransform {
  transform<T>(value: T | null | undefined, fallback = '-'): T | string {
    if (value === null || value === undefined || value === '') {
      return fallback;
    }

    return value;
  }
}
