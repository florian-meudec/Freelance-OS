import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { map, Observable } from 'rxjs';

import { Opportunity } from '../models/opportunity.model';
import { OpportunityResponse } from '../dto/response/opportunity.response';
import { OpportunityMapper } from './opportunity.mapper';
import { API_URL } from '../../../core/config/api.constants';

@Injectable({
  providedIn: 'root',
})
export class OpportunityApiService {
  private readonly http = inject(HttpClient);

  private readonly mapper = inject(OpportunityMapper);

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
}
