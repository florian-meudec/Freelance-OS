import { OpportunityEventType } from './opportunity-event.model';

export interface NextAction {
  type: OpportunityEventType;

  label: string;

  dueDate: string;
}
