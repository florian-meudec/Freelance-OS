import { OpportunityUrgency } from '../models/opportunity.model';
import { OPPORTUNITY_URGENCIES } from '../constants/opportunity.constants';

const MILLISECONDS_IN_DAY = 1000 * 60 * 60 * 24;

const normalizeDateOnly = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};

export const calculateOpportunityUrgency = (nextActionDate: string): OpportunityUrgency => {
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
