import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'daysPerWeek',
  standalone: true,
})
export class DaysPerWeekPipe implements PipeTransform {
  /*
    Formats weekly daysPerWeek values using
    the application's freelance business terminology.
  */
  transform(value?: number): string {
    /*
      Missing values display the shared
      placeholder used across the application.
    */
    if (value == null) {
      return '-';
    }

    return `${value} j/semaine`;
  }
}
