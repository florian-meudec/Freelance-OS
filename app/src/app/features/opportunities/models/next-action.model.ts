import { OpportunityEventType } from '../types/opportunity.type';

export interface NextAction {
  type: OpportunityEventType;

  label: string;

  dueDate: string;
}
