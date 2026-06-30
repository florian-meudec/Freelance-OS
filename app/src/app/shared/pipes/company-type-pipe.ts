import { Pipe, PipeTransform } from '@angular/core';

import { COMPANY_TYPES } from '../../shared/constants/company.constants';

@Pipe({
  name: 'companyType',
  standalone: true,
})
export class CompanyTypePipe implements PipeTransform {
  /*
    Convert stored company type values into
    user-friendly labels for UI rendering.
  */
  transform(value?: string): string {
    if (!value) {
      return '-';
    }

    return Object.values(COMPANY_TYPES).find((item) => item.value === value)?.label ?? value;
  }
}
