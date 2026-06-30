import { OpportunityEventType } from '../types/opportunity.type';

export interface UpdateNextActionCommand {
  type: OpportunityEventType;

  label: string;

  dueDate: string;
}
