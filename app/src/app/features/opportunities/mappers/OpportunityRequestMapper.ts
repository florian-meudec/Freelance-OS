import { Injectable } from '@angular/core';

import { CreateOpportunityCommand } from '../commands/create-opportunity.command';
import { CreateOpportunityRequest } from '../dto/request/create-opportunity.request';

@Injectable({
  providedIn: 'root',
})
export class OpportunityRequestMapper {
  toCreateRequest(command: CreateOpportunityCommand): CreateOpportunityRequest {
    return {
      companyName: command.companyName,

      companyType: command.companyType?.valueOf(),
      industry: command.industry,

      source: command.source,

      contactName: command.contactName,
      contactRole: command.contactRole,
      contactEmail: command.contactEmail,

      missionTitle: command.missionTitle,
      description: command.description,

      stack: command.stack,

      seniority: command.seniority?.valueOf(),

      estimatedStartDate: command.estimatedStartDate,

      durationValue: command.durationValue,
      durationUnit: command.durationUnit?.valueOf(),

      tjm: command.tjm,
      daysPerWeek: command.daysPerWeek,

      modality: command.modality?.valueOf(),
      location: command.location,

      nextAction: {
        type: command.nextAction.type.valueOf(),
        label: command.nextAction.label,
        dueDate: command.nextAction.dueDate,
      },
    };
  }
}
