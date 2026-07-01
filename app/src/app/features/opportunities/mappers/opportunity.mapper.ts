import { CreateOpportunityCommand } from '../commands/create-opportunity.command';
import { UpdateOpportunityCommand } from '../commands/update-opportunity.command';

import { NextAction } from '../models/next-action.model';
import { Opportunity } from '../models/opportunity.model';
import { OpportunityEvent } from '../models/opportunity-event.model';

import { OPPORTUNITY_EVENT_TYPES, OPPORTUNITY_STATUSES } from '../constants/opportunity.constants';

export class OpportunityMapper {
  static toOpportunity(command: CreateOpportunityCommand): Opportunity {
    const createdAt = new Date().toISOString();

    return {
      id: crypto.randomUUID(),

      companyName: command.companyName,
      companyType: command.companyType,
      industry: command.industry,
      source: command.source,

      contactName: command.contactName,
      contactRole: command.contactRole,
      contactEmail: command.contactEmail,

      missionTitle: command.missionTitle,
      description: command.description,

      stack: command.stack,
      seniority: command.seniority,

      estimatedStartDate: command.estimatedStartDate,
      durationValue: command.durationValue,
      durationUnit: command.durationUnit,

      status: OPPORTUNITY_STATUSES.LEAD.value,

      tjm: command.tjm,
      workload: command.workload,

      modality: command.modality,
      location: command.location,

      nextAction: this.createNextAction(command),

      events: [this.createCreationEvent(createdAt)],

      notes: [],
    };
  }

  /*
    Update descriptive opportunity data while
    preserving workflow-related information.
  */
  static update(opportunity: Opportunity, command: UpdateOpportunityCommand): Opportunity {
    return {
      ...opportunity,

      companyName: command.companyName,
      companyType: command.companyType,
      industry: command.industry,
      source: command.source,

      contactName: command.contactName,
      contactRole: command.contactRole,
      contactEmail: command.contactEmail,

      missionTitle: command.missionTitle,
      description: command.description,

      stack: command.stack,
      seniority: command.seniority,

      estimatedStartDate: command.estimatedStartDate,
      durationValue: command.durationValue,
      durationUnit: command.durationUnit,

      tjm: command.tjm,
      workload: command.workload,

      modality: command.modality,
      location: command.location,
    };
  }

  /*
    Build the initial follow-up action
    attached to the opportunity.
  */
  private static createNextAction(command: CreateOpportunityCommand): NextAction {
    return {
      type: command.nextAction.type,
      label: command.nextAction.label,
      dueDate: command.nextAction.dueDate,
    };
  }

  /*
    Every opportunity starts with
    a creation event in its timeline.
  */
  private static createCreationEvent(createdAt: string): OpportunityEvent {
    return {
      id: crypto.randomUUID(),

      type: OPPORTUNITY_EVENT_TYPES.CREATED.value,

      createdAt,

      status: OPPORTUNITY_STATUSES.LEAD.value,
    };
  }
}
