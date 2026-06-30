import { OpportunityEventType } from '../types/opportunity.type';

export interface CreateOpportunityEventCommand {
  type: OpportunityEventType;

  comment?: string;
}
