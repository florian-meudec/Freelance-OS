import { Pipe, PipeTransform } from '@angular/core';

import { OPPORTUNITY_MODALITIES } from '../../features/opportunities/constants/opportunity.constants';

@Pipe({
  name: 'opportunityModality',
  standalone: true,
})
export class OpportunityModalityPipe implements PipeTransform {
  /*
    Convert stored modality values into
    user-friendly labels for UI rendering.
  */
  transform(value?: string): string {
    if (!value) {
      return '';
    }

    return (
      Object.values(OPPORTUNITY_MODALITIES).find((item) => item.value === value)?.label ?? value
    );
  }
}
