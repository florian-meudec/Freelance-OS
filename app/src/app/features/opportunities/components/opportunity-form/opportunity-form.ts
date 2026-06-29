import { Component, output } from '@angular/core';

import { Modal } from '../../../../shared/components/modal/modal';
import { SelectMenu } from '../../../../shared/components/select-menu/select-menu';
import { SelectMenuOption } from '../../../../shared/models/select-menu-option.model';

@Component({
  selector: 'app-opportunity-form',

  standalone: true,

  imports: [Modal, SelectMenu],

  templateUrl: './opportunity-form.html',

  styleUrl: './opportunity-form.scss',
})
export class OpportunityForm {
  readonly closed = output<void>();

  requestClose(): void {
    this.closed.emit();
  }

  readonly noSelection = '';

  readonly companyTypes: SelectMenuOption[] = [];

  readonly modalities: SelectMenuOption[] = [];

  readonly seniorities: SelectMenuOption[] = [];

  readonly durationUnits: SelectMenuOption[] = [];

  readonly nextActionTypes: SelectMenuOption[] = [];
}
