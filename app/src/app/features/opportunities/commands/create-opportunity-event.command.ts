import { OpportunityEventType } from '../types/opportunity.type';

export interface CreateOpportunityEventCommand {
  type: OpportunityEventType;

  occurredAt: string;

  comment?: string;
}
