import { OpportunityEventType } from '../../types/opportunity.type';

export interface NextActionResponse {
  id: string;

  type: OpportunityEventType;

  label: string;

  dueDate: string;

  createdAt: string;
}
