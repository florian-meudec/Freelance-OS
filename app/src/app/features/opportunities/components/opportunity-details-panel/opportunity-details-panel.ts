import { Component, input, output, signal, viewChild } from '@angular/core';

import { Opportunity, OpportunityStatus } from '../../models/opportunity.model';

import { Notes } from '../../../../shared/components/notes/notes';

import { CompanyTypePipe } from '../../../../shared/pipes/company-type-pipe';
import { DurationUnitPipe } from '../../../../shared/pipes/duration-unit-pipe';
import { DateFormatPipe } from '../../../../shared/pipes/date-format-pipe';
import { OpportunityModalityPipe } from '../../../../shared/pipes/opportunity-modality-pipe';
import { OpportunitySeniorityPipe } from '../../../../shared/pipes/opportunity-seniority-pipe';
import { TjmPipe } from '../../../../shared/pipes/tjm-pipe';
import { WorkloadPipe } from '../../../../shared/pipes/workload-pipe';

import { OpportunityEventType } from '../../models/opportunity-event.model';
import { NextAction } from '../../models/next-action.model';

import { OPPORTUNITY_STATUSES } from '../../constants/opportunity.constants';

import { NextActionCard } from '../next-action-card/next-action-card';
import { Timeline } from '../timeline/timeline';

@Component({
  selector: 'app-opportunity-details-panel',

  standalone: true,

  imports: [
    CompanyTypePipe,
    DurationUnitPipe,
    DateFormatPipe,
    Notes,
    OpportunityModalityPipe,
    OpportunitySeniorityPipe,
    TjmPipe,
    WorkloadPipe,
    NextActionCard,
    Timeline,
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
    Timeline events are created by the board
    container to centralize state mutations.
  */
  readonly eventAdd = output<{
    type: OpportunityEventType;
    comment?: string;
  }>();

  /*
    Event updates are delegated upward
    to centralize state mutations.
  */
  readonly eventUpdate = output<{
    eventId: string;
    type: OpportunityEventType;
    comment?: string;
  }>();

  /*
    Event deletions are delegated upward
    to centralize state mutations.
  */
  readonly eventDelete = output<string>();

  /*
    Notes are created by the board container
    to centralize opportunity state mutations.
  */
  readonly noteAdd = output<{
    title: string;
    content: string;
  }>();

  /*
    Note updates are delegated upward
    to centralize state mutations.
  */
  readonly noteUpdate = output<{
    noteId: string;
    title: string;
    content: string;
  }>();

  /*
    Note deletions stay centralized
    inside the board container.
  */
  readonly noteDelete = output<string>();

  /*
    Next action updates remain centralized
    inside the board container.
  */
  readonly nextActionUpdate = output<NextAction>();

  /*
    Completing a follow-up action triggers
    the parent workflow.
  */
  readonly nextActionComplete = output<void>();

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

  readonly notesComponent = viewChild(Notes);

  /*
    The next action workflow is delegated
    to its dedicated component.
  */
  readonly nextActionComponent = viewChild(NextActionCard);

  closePanel(): void {
    if (!this.canClose()) {
      return;
    }

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
    Quick actions can directly trigger
    contextual note creation workflows.
  */
  openQuickNoteForm(): void {
    this.notesComponent()?.openNoteForm();
  }

  /*
    Delegate the workflow opening to the
    dedicated next action component.
  */
  openNextAction(): void {
    this.nextActionComponent()?.scrollIntoView();
  }

  /*
    Indicate whether the panel can safely
    be closed in its current workflow state.
  */
  canClose(): boolean {
    return !this.nextActionComponent()?.isBlocking();
  }
}
