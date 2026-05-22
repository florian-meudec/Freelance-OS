import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'workload',
  standalone: true,
})
export class WorkloadPipe implements PipeTransform {
  /*
    Formats weekly workload values using
    the application's freelance business terminology.
  */
  transform(value: number): string {
    /*
      Empty values return an empty string
      to avoid displaying incomplete workload data.
    */
    if (value == null) {
      return '';
    }

    return `${value} j/semaine`;
  }
}
