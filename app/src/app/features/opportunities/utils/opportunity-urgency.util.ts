import { OpportunityUrgency } from '../models/opportunity.model';
import { OPPORTUNITY_URGENCIES } from '../constants/opportunity.constants';

/*
  Time calculations are normalized to full days
  to avoid timezone and hour precision issues.
*/
const MILLISECONDS_IN_DAY = 1000 * 60 * 60 * 24;

/*
  Removes time information from dates so urgency
  calculations stay consistent across the whole app.
*/
const normalizeDateOnly = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};

/*
  Converts follow-up dates into urgency levels
  used by the board visual prioritization system.
*/
export const calculateOpportunityUrgency = (nextActionDate?: string): OpportunityUrgency => {
  if (!nextActionDate) {
    return OPPORTUNITY_URGENCIES.WAITING.value;
  }

  const nextActionDateNormalized = normalizeDateOnly(new Date(nextActionDate));

  const today = normalizeDateOnly(new Date());

  const diffInMs = nextActionDateNormalized.getTime() - today.getTime();

  const diffInDays = Math.ceil(diffInMs / MILLISECONDS_IN_DAY);

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
