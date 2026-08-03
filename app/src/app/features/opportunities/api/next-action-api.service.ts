import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { map, Observable } from 'rxjs';

import { API_URL } from '../../../core/config/api.constants';

import { Opportunity } from '../models/opportunity.model';
import { NextAction } from '../models/next-action.model';

import { OpportunityResponse } from '../dto/response/opportunity.response';
import { NextActionResponse } from '../dto/response/next-action.response';

import { OpportunityMapper } from './opportunity.mapper';
import { NextActionMapper } from './next-action.mapper';

import { CreateNextActionCommand } from '../commands/create-next-action.command';
import { UpdateNextActionCommand } from '../commands/update-next-action.command';

import { NextActionRequestMapper } from '../mappers/next-action-request.mapper';

@Injectable({
  providedIn: 'root',
})
export class NextActionApiService {
  private readonly http = inject(HttpClient);

  private readonly opportunityMapper = inject(OpportunityMapper);
  private readonly nextActionMapper = inject(NextActionMapper);

  private readonly requestMapper = inject(NextActionRequestMapper);

  private readonly apiUrl = `${API_URL}/opportunities`;

  get(opportunityId: string): Observable<NextAction> {
    return this.http
      .get<NextActionResponse>(`${this.apiUrl}/${opportunityId}/next-action`)
      .pipe(map((response) => this.nextActionMapper.toModel(response)));
  }

  create(opportunityId: string, command: CreateNextActionCommand): Observable<NextAction> {
    const request = this.requestMapper.toCreateRequest(command);

    return this.http
      .post<NextActionResponse>(`${this.apiUrl}/${opportunityId}/next-action`, request)
      .pipe(map((response) => this.nextActionMapper.toModel(response)));
  }

  update(opportunityId: string, command: UpdateNextActionCommand): Observable<NextAction> {
    const request = this.requestMapper.toUpdateRequest(command);

    return this.http
      .put<NextActionResponse>(`${this.apiUrl}/${opportunityId}/next-action`, request)
      .pipe(map((response) => this.nextActionMapper.toModel(response)));
  }

  delete(opportunityId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${opportunityId}/next-action`);
  }

  complete(opportunityId: string): Observable<Opportunity> {
    return this.http
      .post<OpportunityResponse>(`${this.apiUrl}/${opportunityId}/next-action/complete`, {})
      .pipe(map((response) => this.opportunityMapper.toModel(response)));
  }
}
