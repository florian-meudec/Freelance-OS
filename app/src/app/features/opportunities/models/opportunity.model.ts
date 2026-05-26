import {
  COMPANY_TYPES,
  DURATION_UNITS,
  OPPORTUNITY_MODALITIES,
  OPPORTUNITY_SENIORITIES,
  OPPORTUNITY_STATUSES,
  OPPORTUNITY_URGENCIES,
} from '../constants/opportunity.constants';

/*
  Central business model representing a freelance opportunity
  tracked inside the kanban pipeline.
*/
export interface Opportunity {
  id: string;

  /*
    Company classification helps segment
    opportunities by business type.
  */
  companyName: string;
  companyType?: CompanyType;
  industry?: string;
  /*
    Acquisition source helps track where
    opportunities originate from.
  */
  source?: string;

  /*
    Main recruiter or client contact
    associated with the opportunity.
  */
  contactName?: string;
  contactRole?: string;
  contactEmail?: string;

  /*
    Technical and organizational details
    describing the mission scope.
  */
  missionTitle: string;
  description?: string;
  stack?: string[];
  seniority?: OpportunitySeniority;
  /*
    Estimated mission start date stored
    as an ISO date string.
  */
  estimatedStartDate?: string;
  durationValue?: number;
  durationUnit?: DurationUnit;

  status: OpportunityStatus;

  tjm: number;
  workload: number;

  modality: OpportunityModality;
  location: string;

  nextAction: string;
  nextActionDate: string;
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

export type CompanyType = ValueOf<typeof COMPANY_TYPES>['value'];

export type DurationUnit = ValueOf<typeof DURATION_UNITS>['value'];

export type OpportunityModality = ValueOf<typeof OPPORTUNITY_MODALITIES>['value'];

export type OpportunitySeniority = ValueOf<typeof OPPORTUNITY_SENIORITIES>['value'];

export type OpportunityStatus = ValueOf<typeof OPPORTUNITY_STATUSES>['value'];

export type OpportunityUrgency = ValueOf<typeof OPPORTUNITY_URGENCIES>['value'];
