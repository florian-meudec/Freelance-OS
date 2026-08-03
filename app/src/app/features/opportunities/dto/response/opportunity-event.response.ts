import { OpportunityEventType, OpportunityStatus } from '../../types/opportunity.type';

export interface OpportunityEventResponse {
  id: string;

  type: OpportunityEventType;

  status?: OpportunityStatus;

  occurredAt: string;

  comment?: string;
}
