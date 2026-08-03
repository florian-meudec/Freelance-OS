import { Injectable } from '@angular/core';

import { OpportunityEvent } from '../../models/opportunity-event.model';
import { OpportunityEventResponse } from '../../dto/response/opportunity-event.response';

@Injectable({
  providedIn: 'root',
})
export class OpportunityEventMapper {
  toModel(response: OpportunityEventResponse): OpportunityEvent {
    return {
      id: response.id,
      type: response.type,
      status: response.status,
      occurredAt: response.occurredAt,
      comment: response.comment,
    };
  }

  toModelList(responses: OpportunityEventResponse[]): OpportunityEvent[] {
    return responses.map((response) => this.toModel(response));
  }
}
