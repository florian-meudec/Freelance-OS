import { OPPORTUNITY_STATUSES } from '../../constants/opportunity.constants';
import { OpportunityStatus } from '../../types/opportunity.type';

export const STATUS_MAPPING: Record<string, OpportunityStatus> = {
  lead: OPPORTUNITY_STATUSES.LEAD.value,
  contacted: OPPORTUNITY_STATUSES.CONTACTED.value,
  interview: OPPORTUNITY_STATUSES.INTERVIEW.value,
  proposal: OPPORTUNITY_STATUSES.PROPOSAL.value,
  negotiation: OPPORTUNITY_STATUSES.NEGOTIATION.value,
  won: OPPORTUNITY_STATUSES.WON.value,
  lost: OPPORTUNITY_STATUSES.LOST.value,
};
