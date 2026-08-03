import { OpportunityEventType } from '../../types/opportunity.type';

export interface CreateNextActionRequest {
  type: OpportunityEventType;

  label: string;

  dueDate: string;
}
