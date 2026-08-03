import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { map, Observable } from 'rxjs';

import { API_URL } from '../../../core/config/api.constants';

import { OpportunityEvent } from '../models/opportunity-event.model';

import { OpportunityEventMapper } from './mappers/opportunity-event.mapper';
import { OpportunityEventRequestMapper } from '../mappers/opportunity-event-request.mapper';

import { OpportunityEventResponse } from '../dto/response/opportunity-event.response';

import { CreateOpportunityEventCommand } from '../commands/create-opportunity-event.command';
import { UpdateOpportunityEventCommand } from '../commands/update-opportunity-event.command';

@Injectable({
  providedIn: 'root',
})
export class OpportunityEventApiService {
  private readonly http = inject(HttpClient);

  private readonly mapper = inject(OpportunityEventMapper);

  private readonly requestMapper = inject(OpportunityEventRequestMapper);

  getAll(opportunityId: string): Observable<OpportunityEvent[]> {
    return this.http
      .get<OpportunityEventResponse[]>(`${API_URL}/opportunities/${opportunityId}/events`)
      .pipe(map((responses) => this.mapper.toModelList(responses)));
  }

  create(
    opportunityId: string,
    command: CreateOpportunityEventCommand,
  ): Observable<OpportunityEvent> {
    return this.http
      .post<OpportunityEventResponse>(
        `${API_URL}/opportunities/${opportunityId}/events`,
        this.requestMapper.toCreateRequest(command),
      )
      .pipe(map((response) => this.mapper.toModel(response)));
  }

  update(
    opportunityId: string,
    eventId: string,
    command: UpdateOpportunityEventCommand,
  ): Observable<OpportunityEvent> {
    return this.http
      .put<OpportunityEventResponse>(
        `${API_URL}/opportunities/${opportunityId}/events/${eventId}`,
        this.requestMapper.toUpdateRequest(command),
      )
      .pipe(map((response) => this.mapper.toModel(response)));
  }

  delete(opportunityId: string, eventId: string): Observable<void> {
    return this.http.delete<void>(`${API_URL}/opportunities/${opportunityId}/events/${eventId}`);
  }
}
