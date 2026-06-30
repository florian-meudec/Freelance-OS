import {
  OPPORTUNITY_EVENT_TYPES,
  OPPORTUNITY_STATUSES,
  OPPORTUNITY_URGENCIES,
} from '../constants/opportunity.constants';

/*
  Utility type used to extract values from constant objects
  while preserving full TypeScript inference.
*/
type ValueOf<T> = T[keyof T];

/*
  Opportunity-specific business types.
*/
export type OpportunityStatus = ValueOf<typeof OPPORTUNITY_STATUSES>['value'];

export type OpportunityUrgency = ValueOf<typeof OPPORTUNITY_URGENCIES>['value'];

export type OpportunityEventType = ValueOf<typeof OPPORTUNITY_EVENT_TYPES>['value'];
