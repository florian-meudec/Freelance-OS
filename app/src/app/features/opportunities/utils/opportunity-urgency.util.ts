import { OPPORTUNITY_URGENCIES } from '../constants/opportunity.constants';
import { OpportunityUrgency } from '../types/opportunity.type';

/*
  Time calculations are normalized to full days
  to avoid timezone and hour precision issues.
*/
const MILLISECONDS_IN_DAY = 1000 * 60 * 60 * 24;

export const getCalendarDayDifference = (
  dateOnly?: string,
  referenceDate = new Date(),
): number | null => {
  if (!dateOnly) {
    return null;
  }

  const [year, month, day] = dateOnly.split('-').map(Number);
  const parsedDate = new Date(Date.UTC(year, month - 1, day));
  const referenceDateOnly = new Date(
    Date.UTC(referenceDate.getFullYear(), referenceDate.getMonth(), referenceDate.getDate()),
  );

  if (
    !Number.isInteger(year) ||
    !Number.isInteger(month) ||
    !Number.isInteger(day) ||
    parsedDate.getUTCFullYear() !== year ||
    parsedDate.getUTCMonth() !== month - 1 ||
    parsedDate.getUTCDate() !== day
  ) {
    return null;
  }

  return Math.round((parsedDate.getTime() - referenceDateOnly.getTime()) / MILLISECONDS_IN_DAY);
};

/*
  Converts follow-up dates into urgency levels
  used by the board visual prioritization system.
*/
export const calculateOpportunityUrgency = (nextActionDate?: string): OpportunityUrgency => {
  if (!nextActionDate) {
    return OPPORTUNITY_URGENCIES.WAITING.value;
  }

  const diffInDays = getCalendarDayDifference(nextActionDate);

  if (diffInDays === null) {
    return OPPORTUNITY_URGENCIES.WAITING.value;
  }

  if (diffInDays < OPPORTUNITY_URGENCIES.LATE.threshold) {
    return OPPORTUNITY_URGENCIES.LATE.value;
  }

  if (diffInDays === OPPORTUNITY_URGENCIES.TODAY.threshold) {
    return OPPORTUNITY_URGENCIES.TODAY.value;
  }

  if (diffInDays <= OPPORTUNITY_URGENCIES.THIS_WEEK.threshold) {
    return OPPORTUNITY_URGENCIES.THIS_WEEK.value;
  }

  return OPPORTUNITY_URGENCIES.WAITING.value;
};
