import { OpportunityEventType } from '../types/opportunity.type';

export interface CreateNextActionCommand {
  type: OpportunityEventType;

  label: string;

  dueDate: string;
}
