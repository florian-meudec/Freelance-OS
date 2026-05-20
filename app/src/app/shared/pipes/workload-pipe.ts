import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'workload',
  standalone: true,
})
export class WorkloadPipe implements PipeTransform {
  transform(value: number): string {
    if (value == null) {
      return '';
    }

    return `${value} j/semaine`;
  }
}
