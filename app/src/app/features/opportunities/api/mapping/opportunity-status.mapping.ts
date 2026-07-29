import { OPPORTUNITY_STATUSES } from '../../constants/opportunity.constants';
import { OpportunityStatus } from '../../types/opportunity.type';

export const STATUS_MAPPING: Record<string, OpportunityStatus> = {
  LEAD: OPPORTUNITY_STATUSES.LEAD.value,
  CONTACTED: OPPORTUNITY_STATUSES.CONTACTED.value,
  INTERVIEW: OPPORTUNITY_STATUSES.INTERVIEW.value,
  PROPOSAL: OPPORTUNITY_STATUSES.PROPOSAL.value,
  NEGOTIATION: OPPORTUNITY_STATUSES.NEGOTIATION.value,
  WON: OPPORTUNITY_STATUSES.WON.value,
  LOST: OPPORTUNITY_STATUSES.LOST.value,
};
