import { DURATION_UNITS } from '../../../../shared/constants/duration.constants';
import { DurationUnit } from '../../../../shared/types/duration.type';

export const DURATION_UNIT_MAPPING: Record<string, DurationUnit> = {
  days: DURATION_UNITS.DAYS.value,
  weeks: DURATION_UNITS.WEEKS.value,
  months: DURATION_UNITS.MONTHS.value,
  years: DURATION_UNITS.YEARS.value,
};
