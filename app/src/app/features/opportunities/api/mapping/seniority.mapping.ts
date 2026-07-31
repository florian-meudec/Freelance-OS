import { SENIORITIES } from '../../../../shared/constants/seniority.constants';
import { Seniority } from '../../../../shared/types/seniority.type';

export const SENIORITY_MAPPING: Record<string, Seniority> = {
  junior: SENIORITIES.JUNIOR.value,
  confirmed: SENIORITIES.CONFIRMED.value,
  senior: SENIORITIES.SENIOR.value,
  lead: SENIORITIES.LEAD.value,
};
