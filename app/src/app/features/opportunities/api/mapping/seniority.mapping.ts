import { SENIORITIES } from '../../../../shared/constants/seniority.constants';
import { Seniority } from '../../../../shared/types/seniority.type';

export const SENIORITY_MAPPING: Record<string, Seniority> = {
  JUNIOR: SENIORITIES.JUNIOR.value,
  CONFIRMED: SENIORITIES.CONFIRMED.value,
  SENIOR: SENIORITIES.SENIOR.value,
  LEAD: SENIORITIES.LEAD.value,
};
