import { OpportunityEventType } from '../../types/opportunity.type';

export interface UpdateOpportunityEventRequest {
  type: OpportunityEventType;

  occurredAt: string;

  comment?: string;
}
