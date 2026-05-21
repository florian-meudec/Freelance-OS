import { Component, input, output } from '@angular/core';

import { Opportunity } from '../../models/opportunity.model';

import { DateFormatPipe } from '../../../../shared/pipes/date-format-pipe';
import { TjmPipe } from '../../../../shared/pipes/tjm-pipe';
import { WorkloadPipe } from '../../../../shared/pipes/workload-pipe';

@Component({
  selector: 'app-opportunity-details-panel',

  standalone: true,

  imports: [DateFormatPipe, TjmPipe, WorkloadPipe],

  templateUrl: './opportunity-details-panel.html',

  styleUrl: './opportunity-details-panel.scss',
})
export class OpportunityDetailsPanel {
  readonly opportunity = input.required<Opportunity>();

  readonly panelClose = output<void>();

  closePanel(): void {
    this.panelClose.emit();
  }
}
