import { OpportunityEventType } from '../types/opportunity.type';

export interface UpdateOpportunityEventCommand {
  type: OpportunityEventType;

  occurredAt: string;

  comment?: string;
}
