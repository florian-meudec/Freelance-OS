import { CompanyType } from '../../../shared/types/company.type';
import { DurationUnit } from '../../../shared/types/duration.type';
import { Seniority } from '../../../shared/types/seniority.type';
import { WorkModality } from '../../../shared/types/work-modality.type';

/*
  The next action is intentionally excluded.
  It is managed by its dedicated workflow.
*/
export interface UpdateOpportunityCommand {
  id: string;

  companyName: string;

  companyType?: CompanyType;

  industry?: string;

  source: string;

  contactName?: string;

  contactRole?: string;

  contactEmail?: string;

  missionTitle: string;

  description?: string;

  stack: string[];

  seniority?: Seniority;

  estimatedStartDate?: string;

  durationValue?: number;

  durationUnit?: DurationUnit;

  tjm?: number;

  workload?: number;

  modality?: WorkModality;

  location?: string;
}
