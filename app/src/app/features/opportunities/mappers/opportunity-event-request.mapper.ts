import { Injectable } from '@angular/core';

import { CreateOpportunityEventCommand } from '../commands/create-opportunity-event.command';
import { UpdateOpportunityEventCommand } from '../commands/update-opportunity-event.command';

import { CreateOpportunityEventRequest } from '../dto/request/create-opportunity-event.request';
import { UpdateOpportunityEventRequest } from '../dto/request/update-opportunity-event.request';

@Injectable({
  providedIn: 'root',
})
export class OpportunityEventRequestMapper {
  toCreateRequest(command: CreateOpportunityEventCommand): CreateOpportunityEventRequest {
    return {
      type: command.type,
      occurredAt: command.occurredAt,
      comment: command.comment,
    };
  }

  toUpdateRequest(command: UpdateOpportunityEventCommand): UpdateOpportunityEventRequest {
    return {
      type: command.type,
      occurredAt: command.occurredAt,
      comment: command.comment,
    };
  }
}
