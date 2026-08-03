import { OpportunityEventType } from '../../types/opportunity.type';

export interface CreateOpportunityEventRequest {
  type: OpportunityEventType;

  occurredAt: string;

  comment?: string;
}
