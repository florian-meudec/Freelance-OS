import { CompanyType } from '../../../shared/types/company.type';
import { Seniority } from '../../../shared/types/seniority.type';
import { WorkModality } from '../../../shared/types/work-modality.type';

export type NextActionDueInDays = number | '7-plus';

/*
  Board filters capture the current
  user-defined search criteria.
*/
export interface OpportunityFilters {
  modalities: WorkModality[];
  seniorities: Seniority[];
  companyTypes: CompanyType[];
  sources: string[];
  minimumDailyRate: number | null;
  nextActionDueInDays: NextActionDueInDays[];
}
