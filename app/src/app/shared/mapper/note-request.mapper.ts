import { Injectable } from '@angular/core';
import { CreateNoteCommand } from '../../features/notes/commands/create-note.command';
import { CreateNoteRequest } from '../../features/notes/dto/request/create-note.request';
import { UpdateNoteCommand } from '../../features/notes/commands/update-note.command';
import { UpdateNoteRequest } from '../../features/notes/dto/request/update-note.request';

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
