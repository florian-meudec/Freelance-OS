import { Injectable } from '@angular/core';
import { OpportunityResponse } from '../../dto/response/opportunity.response';
import { Opportunity } from '../../models/opportunity.model';
import { COMPANY_TYPE_MAPPING } from '../mapping/company-type.mapping';
import { MODALITY_MAPPING } from '../mapping/opportunity-modality.mapping';
import { SENIORITY_MAPPING } from '../mapping/seniority.mapping';
import { DURATION_UNIT_MAPPING } from '../mapping/duration-unit.mapping';
import { STATUS_MAPPING } from '../mapping/opportunity-status.mapping';

@Injectable({
  providedIn: 'root',
})
export class OpportunityMapper {
  toModel(response: OpportunityResponse): Opportunity {
    return {
      ...response,

      status: STATUS_MAPPING[response.status],

      companyType: response.companyType ? COMPANY_TYPE_MAPPING[response.companyType] : undefined,

      modality: response.modality ? MODALITY_MAPPING[response.modality] : undefined,

      seniority: response.seniority ? SENIORITY_MAPPING[response.seniority] : undefined,

      durationUnit: response.durationUnit
        ? DURATION_UNIT_MAPPING[response.durationUnit]
        : undefined,

      industry: response.industry ?? undefined,
      description: response.description ?? undefined,
      contactName: response.contactName ?? undefined,
      contactRole: response.contactRole ?? undefined,
      contactEmail: response.contactEmail ?? undefined,
      contactPhone: response.contactPhone ?? undefined,
      location: response.location ?? undefined,
      tjm: response.tjm ?? undefined,
      durationValue: response.durationValue ?? undefined,
      daysPerWeek: response.daysPerWeek ?? undefined,

      stack: response.stack ?? [],
      notes: response.notes ?? [],
      events: response.events ?? [],
      nextAction: response.nextAction ?? null,
    };
  }

  toModelList(responses: OpportunityResponse[]): Opportunity[] {
    return responses.map((response) => this.toModel(response));
  }
}
