import {
  OPPORTUNITY_MODALITIES,
  OPPORTUNITY_STATUSES,
  OPPORTUNITY_URGENCIES,
} from '../constants/opportunity.constants';

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

type ValueOf<T> = T[keyof T];

export type OpportunityStatus = ValueOf<typeof OPPORTUNITY_STATUSES>;

export type OpportunityModality = ValueOf<typeof OPPORTUNITY_MODALITIES>['value'];

export type OpportunityUrgency = ValueOf<typeof OPPORTUNITY_URGENCIES>['value'];
