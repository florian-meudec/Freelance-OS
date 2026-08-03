import { Injectable } from '@angular/core';

import { CreateNoteCommand } from '../commands/create-note.command';
import { UpdateNoteCommand } from '../commands/update-note.command';

import { CreateNoteRequest } from '../dto/request/create-note.request';
import { UpdateNoteRequest } from '../dto/request/update-note.request';

@Injectable({
  providedIn: 'root',
})
export class NoteRequestMapper {
  toCreateRequest(command: CreateNoteCommand): CreateNoteRequest {
    return {
      title: command.title,
      content: command.content,
    };
  }

  toUpdateRequest(command: UpdateNoteCommand): UpdateNoteRequest {
    return {
      title: command.title,
      content: command.content,
    };
  }
}
