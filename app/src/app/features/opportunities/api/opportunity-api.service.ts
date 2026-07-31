import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { map, Observable } from 'rxjs';

import { Opportunity } from '../models/opportunity.model';
import { OpportunityResponse } from '../dto/response/opportunity.response';
import { OpportunityMapper } from './opportunity.mapper';
import { API_URL } from '../../../core/config/api.constants';
import { CreateOpportunityCommand } from '../commands/create-opportunity.command';
import { UpdateOpportunityCommand } from '../commands/update-opportunity.command';
import { OpportunityRequestMapper } from '../mappers/opportunity-request-mapper';

@Injectable({
  providedIn: 'root',
})
export class OpportunityApiService {
  private readonly http = inject(HttpClient);

  private readonly mapper = inject(OpportunityMapper);
  private readonly requestMapper = inject(OpportunityRequestMapper);

  private readonly apiUrl = `${API_URL}/opportunities`;

  getAll(): Observable<Opportunity[]> {
    return this.http
      .get<OpportunityResponse[]>(this.apiUrl)
      .pipe(map((responses) => this.mapper.toModelList(responses)));
  }

  getById(id: string): Observable<Opportunity> {
    return this.http
      .get<OpportunityResponse>(`${this.apiUrl}/${id}`)
      .pipe(map((response) => this.mapper.toModel(response)));
  }

  create(command: CreateOpportunityCommand): Observable<Opportunity> {
    const request = this.requestMapper.toCreateRequest(command);

    return this.http
      .post<OpportunityResponse>(this.apiUrl, request)
      .pipe(map((response) => this.mapper.toModel(response)));
  }

  update(id: string, command: UpdateOpportunityCommand): Observable<Opportunity> {
    const request = this.requestMapper.toUpdateRequest(command);

    return this.http
      .put<OpportunityResponse>(`${this.apiUrl}/${id}`, request)
      .pipe(map((response) => this.mapper.toModel(response)));
  }
}
