import {
  OPPORTUNITY_MODALITIES,
  OPPORTUNITY_STATUSES,
  OPPORTUNITY_URGENCIES,
} from '../constants/opportunity.constants';

/*
  Central business model representing a freelance opportunity
  tracked inside the kanban pipeline.
*/
export interface Opportunity {
  id: string;

  companyName: string;
  missionTitle: string;

  status: OpportunityStatus;

  tjm: number;
  workload: number;

  modality: OpportunityModality;
  location: string;

  nextAction: string;
  nextActionDate: string;

  startDate?: string;
}

/*
  Utility type used to extract values from constant objects
  while preserving full TypeScript inference.
*/
type ValueOf<T> = T[keyof T];

/*
  Opportunity types are generated directly from constants
  to keep business rules centralized and type-safe.
*/
export type OpportunityStatus = ValueOf<typeof OPPORTUNITY_STATUSES>['value'];

export type OpportunityModality = ValueOf<typeof OPPORTUNITY_MODALITIES>['value'];

export type OpportunityUrgency = ValueOf<typeof OPPORTUNITY_URGENCIES>['value'];
