import { OPPORTUNITY_EVENT_TYPES } from '../constants/opportunity.constants';
import { OpportunityStatus } from './opportunity.model';

/*
  Timeline events track important
  opportunity lifecycle history.
*/
export interface OpportunityEvent {
  id: string;

  type: OpportunityEventType;
  /*
    Status snapshots are attached to
    workflow transition events.
  */
  status?: OpportunityStatus;
  createdAt: string;
  comment?: string;
}

/*
  Utility type used to extract values from constant objects
  while preserving full TypeScript inference.
*/
type ValueOf<T> = T[keyof T];

/*
  Event types are generated directly from constants
  to keep timeline behavior centralized.
*/
export type OpportunityEventType = ValueOf<typeof OPPORTUNITY_EVENT_TYPES>['value'];
