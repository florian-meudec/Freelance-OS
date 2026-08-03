import { Injectable } from '@angular/core';

import { Note } from '../../../shared/models/note.model';
import { NoteResponse } from '../dto/response/note.response';

@Injectable({
  providedIn: 'root',
})
export class NoteMapper {
  toModel(response: NoteResponse): Note {
    return {
      id: response.id,
      title: response.title,
      content: response.content,
      createdAt: response.createdAt,
    };
  }

  toModelList(responses: NoteResponse[]): Note[] {
    return responses.map((response) => this.toModel(response));
  }
}
