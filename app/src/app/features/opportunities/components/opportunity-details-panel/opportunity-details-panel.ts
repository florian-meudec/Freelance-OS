import { Component, computed, input, output, signal } from '@angular/core';

import { Opportunity, OpportunityStatus } from '../../models/opportunity.model';

import { CompanyTypePipe } from '../../../../shared/pipes/company-type-pipe';
import { DurationUnitPipe } from '../../../../shared/pipes/duration-unit-pipe';
import { DateFormatPipe } from '../../../../shared/pipes/date-format-pipe';
import { OpportunityModalityPipe } from '../../../../shared/pipes/opportunity-modality-pipe';
import { OpportunitySeniorityPipe } from '../../../../shared/pipes/opportunity-seniority-pipe';
import { TjmPipe } from '../../../../shared/pipes/tjm-pipe';
import { WorkloadPipe } from '../../../../shared/pipes/workload-pipe';
import { OpportunityEvent } from '../../models/opportunity-event.model';
import {
  OPPORTUNITY_EVENT_TYPES,
  OPPORTUNITY_STATUSES,
} from '../../constants/opportunity.constants';

@Component({
  selector: 'app-opportunity-details-panel',

  standalone: true,

  imports: [
    CompanyTypePipe,
    DurationUnitPipe,
    DateFormatPipe,
    OpportunityModalityPipe,
    OpportunitySeniorityPipe,
    TjmPipe,
    WorkloadPipe,
  ],

  templateUrl: './opportunity-details-panel.html',

  styleUrl: './opportunity-details-panel.scss',
})
export class OpportunityDetailsPanel {
  /*
    The selected opportunity is controlled
    by the board container component.
  */
  readonly opportunity = input.required<Opportunity>();

  /*
    Closing logic stays in the parent container
    to keep this component presentation-focused.
  */
  readonly panelClose = output<void>();

  /*
    Status updates are delegated to the board
    container to keep state mutations centralized.
  */
  readonly statusChange = output<OpportunityStatus>();

  /*
    Status options are generated directly from
    business constants to preserve consistency.
  */
  readonly statuses = Object.values(OPPORTUNITY_STATUSES);

  /*
    Status menu visibility is handled locally
    to keep workflow interactions lightweight.
  */
  readonly showStatusMenu = signal(false);

  /*
    Timeline events are sorted from newest
    to oldest to prioritize recent activity.
  */
  readonly sortedEvents = computed(() =>
    [...this.opportunity().events].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    ),
  );

  /*
    Notes are sorted from newest
    to oldest for faster scanning.
  */
  readonly sortedNotes = computed(() =>
    [...this.opportunity().notes].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    ),
  );

  closePanel(): void {
    this.panelClose.emit();
  }

  toggleStatusMenu(): void {
    this.showStatusMenu.update((value) => !value);
  }

  selectStatus(status: OpportunityStatus): void {
    this.statusChange.emit(status);

    this.showStatusMenu.set(false);
  }

  /*
    Generate user-facing event labels
    directly from timeline event data.
  */
  getEventLabel(event: OpportunityEvent): string {
    if (event.type === OPPORTUNITY_EVENT_TYPES.STATUS_CHANGED.value && event.status) {
      const statusLabel =
        Object.values(OPPORTUNITY_STATUSES).find((status) => status.value === event.status)
          ?.label ?? event.status;

      return `Passage en statut ${statusLabel}`;
    }

    return (
      Object.values(OPPORTUNITY_EVENT_TYPES).find((type) => type.value === event.type)?.label ??
      event.type
    );
  }
}
