import { Note } from '../../../shared/models/note.model';
import { CompanyType } from '../../../shared/types/company.type';
import { DurationUnit } from '../../../shared/types/duration.type';
import { Seniority } from '../../../shared/types/seniority.type';
import { WorkModality } from '../../../shared/types/work-modality.type';

import { NextAction } from './next-action.model';
import { OpportunityEvent } from './opportunity-event.model';
import { OpportunityStatus } from '../types/opportunity.type';

/*
  Central business model representing a freelance opportunity
  tracked inside the kanban pipeline.
*/
export interface Opportunity {
  id: string;

  companyName: string;

  /*
    Company classification helps segment
    opportunities by business type.
  */
  companyType?: CompanyType;

  industry?: string;

  /*
    Acquisition source helps track where
    opportunities originate from.
  */
  source: string;

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

  stack: string[];

  seniority?: Seniority;

  /*
    Estimated mission start date stored
    as an ISO date string.
  */
  estimatedStartDate?: string;

  durationValue?: number;
  durationUnit?: DurationUnit;

  status: OpportunityStatus;

  tjm?: number;
  daysPerWeek?: number;

  modality?: WorkModality;
  location?: string;

  /*
    Current follow-up driving the next
    interaction with the opportunity.
  */
  nextAction: NextAction | null;

  /*
    Timeline history centralizes important
    business and workflow events.
  */
  events: OpportunityEvent[];

  /*
    Notes centralize human context and
    qualitative follow-up information.
  */
  notes: Note[];
}
