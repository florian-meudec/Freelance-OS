import { DURATION_UNITS } from '../../../../shared/constants/duration.constants';
import { DurationUnit } from '../../../../shared/types/duration.type';

export const DURATION_UNIT_MAPPING: Record<string, DurationUnit> = {
  DAYS: DURATION_UNITS.DAYS.value,
  WEEKS: DURATION_UNITS.WEEKS.value,
  MONTHS: DURATION_UNITS.MONTHS.value,
  YEARS: DURATION_UNITS.YEARS.value,
};
