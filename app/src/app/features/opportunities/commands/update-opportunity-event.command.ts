import { OpportunityEventType } from '../types/opportunity.type';

export interface UpdateOpportunityEventCommand {
  id: string;

  type: OpportunityEventType;

  comment?: string;
}
