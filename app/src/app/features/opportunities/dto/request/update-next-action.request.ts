import { OpportunityEventType } from '../../types/opportunity.type';

export interface UpdateNextActionRequest {
  type: OpportunityEventType;

  label: string;

  dueDate: string;
}
