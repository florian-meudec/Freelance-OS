import { OpportunityEventType, OpportunityStatus } from '../types/opportunity.type';

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

  occurredAt: string;

  comment?: string;
}
