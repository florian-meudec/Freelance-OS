export interface CreateOpportunityRequest {
  companyName: string;

  companyType?: string;

  industry?: string;

  source: string;

  contactName?: string;

  contactRole?: string;

  contactEmail?: string;

  missionTitle: string;

  description?: string;

  stack: string[];

  seniority?: string;

  estimatedStartDate?: string;

  durationValue?: number;

  durationUnit?: string;

  tjm?: number;

  daysPerWeek?: number;

  modality?: string;

  location?: string;

  nextAction: {
    type: string;

    label: string;

    dueDate: string;
  };
}
