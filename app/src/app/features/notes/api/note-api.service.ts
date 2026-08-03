import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { map, Observable } from 'rxjs';

import { API_URL } from '../../../core/config/api.constants';

import { Note } from '../../../shared/models/note.model';

import { NoteMapper } from '../mappers/note.mapper';
import { NoteRequestMapper } from '../mappers/note-request.mapper';

import { NoteResponse } from '../dto/response/note.response';

import { CreateNoteCommand } from '../commands/create-note.command';
import { UpdateNoteCommand } from '../commands/update-note.command';

@Injectable({
  providedIn: 'root',
})
export class NoteApiService {
  private readonly http = inject(HttpClient);

  private readonly mapper = inject(NoteMapper);

  private readonly requestMapper = inject(NoteRequestMapper);

  private readonly apiUrl = `${API_URL}/opportunities`;

  getAll(opportunityId: string): Observable<Note[]> {
    return this.http
      .get<NoteResponse[]>(`${this.apiUrl}/${opportunityId}/notes`)
      .pipe(map((responses) => this.mapper.toModelList(responses)));
  }

  create(opportunityId: string, command: CreateNoteCommand): Observable<Note> {
    return this.http
      .post<NoteResponse>(
        `${this.apiUrl}/${opportunityId}/notes`,
        this.requestMapper.toCreateRequest(command),
      )
      .pipe(map((response) => this.mapper.toModel(response)));
  }

  update(opportunityId: string, noteId: string, command: UpdateNoteCommand): Observable<Note> {
    return this.http
      .put<NoteResponse>(
        `${this.apiUrl}/${opportunityId}/notes/${noteId}`,
        this.requestMapper.toUpdateRequest(command),
      )
      .pipe(map((response) => this.mapper.toModel(response)));
  }

  delete(opportunityId: string, noteId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${opportunityId}/notes/${noteId}`);
  }
}
