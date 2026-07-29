import { Note } from '../../../../shared/models/note.model';
import { NextAction } from '../../models/next-action.model';
import { OpportunityEvent } from '../../models/opportunity-event.model';

export interface OpportunityResponse {
  id: string;

  companyName: string;
  missionTitle: string;

  status: string;

  contactName: string | null;
  contactRole: string | null;
  contactEmail: string | null;
  contactPhone: string | null;

  modality: string | null;
  companyType: string | null;
  seniority: string | null;

  tjm: number | null;

  durationValue: number | null;
  durationUnit: string | null;

  daysPerWeek: number | null;

  source: string;
  industry: string | null;
  location: string | null;

  stack: string[];

  description: string | null;

  nextAction: NextAction | null;

  notes: Note[];

  events: OpportunityEvent[];

  createdAt: string;
  updatedAt: string;
}
