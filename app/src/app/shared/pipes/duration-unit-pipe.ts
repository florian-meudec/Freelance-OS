import { Pipe, PipeTransform } from '@angular/core';

import { DURATION_UNITS } from '../../features/opportunities/constants/opportunity.constants';

@Pipe({
  name: 'durationUnit',
  standalone: true,
})
export class DurationUnitPipe implements PipeTransform {
  /*
    Convert stored duration unit values
    into user-friendly labels.
  */
  transform(value?: string): string {
    if (!value) {
      return '';
    }

    return Object.values(DURATION_UNITS).find((item) => item.value === value)?.label ?? value;
  }
}
