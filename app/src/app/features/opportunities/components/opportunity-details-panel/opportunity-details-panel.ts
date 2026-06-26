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
import { SelectMenu } from '../../../../shared/components/select-menu/select-menu';
import { Timeline } from '../timeline/timeline';
import { FallbackPipe } from '../../../../shared/pipes/fallback-pipe';

@Component({
  selector: 'app-opportunity-details-panel',

  standalone: true,

  imports: [
    CompanyTypePipe,
    DurationUnitPipe,
    DateFormatPipe,
    FallbackPipe,
    Notes,
    OpportunityModalityPipe,
    OpportunitySeniorityPipe,
    TjmPipe,
    WorkloadPipe,
    NextActionCard,
    SelectMenu,
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
    The requested terminal status is forwarded
    to the next action workflow.
  */
  readonly pendingStatus = input<OpportunityStatus | null>(null);

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
    Completing the pending follow-up action
    allows the status transition to continue.
  */
  readonly nextActionCompleteForStatusChange = output<void>();

  /*
    Abandoning the pending follow-up action
    allows the status transition to continue.
  */
  readonly nextActionDeleteForStatusChange = output<void>();

  /*
    Cancelling the status transition restores
    the previous opportunity state.
  */
  readonly statusChangeCancelled = output<void>();

  /*
    Status options are generated directly from
    business constants to preserve consistency.
  */
  readonly statuses = Object.values(OPPORTUNITY_STATUSES);

  readonly notesComponent = viewChild(Notes);

  /*
    The next action workflow is delegated
    to its dedicated component.
  */
  readonly nextActionComponent = viewChild(NextActionCard);

  /*
  Temporary feedback confirms that the
  contact email has been copied.
*/
  readonly emailCopied = signal(false);

  private copyFeedbackTimeout?: ReturnType<typeof setTimeout>;

  closePanel(): void {
    if (!this.canClose()) {
      return;
    }

    this.panelClose.emit();
  }

  selectStatus(status: string): void {
    this.statusChange.emit(status as OpportunityStatus);
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
  scrollToNextAction(): void {
    this.nextActionComponent()?.scrollIntoView();
  }

  /*
    Indicate whether the panel can safely
    be closed in its current workflow state.
  */
  canClose(): boolean {
    return !this.nextActionComponent()?.isBlocking();
  }

  openStatusChange(): void {
    this.nextActionComponent()?.openStatusChange();
  }

  openMandatoryNextAction(): void {
    this.nextActionComponent()?.openMandatory();
  }

  closeStatusChange(): void {
    this.nextActionComponent()?.close();
  }

  copyEmail(): void {
    const email = this.opportunity().contactEmail;

    if (!email) {
      return;
    }

    navigator.clipboard.writeText(email);

    this.emailCopied.set(true);

    clearTimeout(this.copyFeedbackTimeout);

    this.copyFeedbackTimeout = setTimeout(() => {
      this.emailCopied.set(false);
    }, 2000);
  }
}
