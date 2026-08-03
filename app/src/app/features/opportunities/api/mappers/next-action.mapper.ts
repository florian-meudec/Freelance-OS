import { Injectable } from '@angular/core';
import { NextAction } from '../../models/next-action.model';
import { NextActionResponse } from '../../dto/response/next-action.response';

@Injectable({
  providedIn: 'root',
})
export class NextActionMapper {
  /*
    Convert the backend response into
    the frontend business model.
  */
  toModel(response: NextActionResponse): NextAction {
    return {
      id: response.id,
      type: response.type,
      label: response.label,
      dueDate: response.dueDate,
      createdAt: response.createdAt,
    };
  }
}
