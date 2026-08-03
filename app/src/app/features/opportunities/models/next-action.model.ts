import { OpportunityEventType } from '../types/opportunity.type';

/*
  Next actions represent the immediate
  follow-up planned for an opportunity.
*/
export interface NextAction {
  id: string;

  type: OpportunityEventType;

  label: string;

  dueDate: string;

  createdAt: string;
}
