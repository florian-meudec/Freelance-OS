import { Injectable } from '@angular/core';

import { CreateNextActionCommand } from '../commands/create-next-action.command';
import { UpdateNextActionCommand } from '../commands/update-next-action.command';

import { CreateNextActionRequest } from '../dto/request/create-next-action.request';
import { UpdateNextActionRequest } from '../dto/request/update-next-action.request';

@Injectable({
  providedIn: 'root',
})
export class NextActionRequestMapper {
  /*
    Convert the creation command into
    the backend request payload.
  */
  toCreateRequest(command: CreateNextActionCommand): CreateNextActionRequest {
    return {
      type: command.type,
      label: command.label,
      dueDate: command.dueDate,
    };
  }

  /*
    Convert the update command into
    the backend request payload.
  */
  toUpdateRequest(command: UpdateNextActionCommand): UpdateNextActionRequest {
    return {
      type: command.type,
      label: command.label,
      dueDate: command.dueDate,
    };
  }
}
