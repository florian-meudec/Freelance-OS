import { Pipe, PipeTransform } from '@angular/core';

import { WORK_MODALITIES } from '../../shared/constants/work-modality.constants';

@Pipe({
  name: 'opportunityModality',
  standalone: true,
})
export class OpportunityModalityPipe implements PipeTransform {
  /*
    Convert stored work modality values into
    user-friendly labels for UI rendering.
  */
  transform(value?: string): string {
    if (!value) {
      return '-';
    }

    return Object.values(WORK_MODALITIES).find((item) => item.value === value)?.label ?? value;
  }
}
