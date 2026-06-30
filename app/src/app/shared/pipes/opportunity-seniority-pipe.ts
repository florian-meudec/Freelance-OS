import { Pipe, PipeTransform } from '@angular/core';

import { SENIORITIES } from '../../shared/constants/seniority.constants';

@Pipe({
  name: 'opportunitySeniority',
  standalone: true,
})
export class OpportunitySeniorityPipe implements PipeTransform {
  /*
    Convert stored seniority values into
    user-facing labels for UI rendering.
  */
  transform(value?: string): string {
    if (!value) {
      return '-';
    }

    return Object.values(SENIORITIES).find((item) => item.value === value)?.label ?? value;
  }
}
