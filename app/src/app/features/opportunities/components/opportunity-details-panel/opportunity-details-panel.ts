import { Component, effect, inject, input, output, signal, viewChild } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';

import { Opportunity } from '../../models/opportunity.model';
import { NextAction } from '../../models/next-action.model';
import { OpportunityEventType, OpportunityStatus } from '../../types/opportunity.type';

import { OPPORTUNITY_STATUSES } from '../../constants/opportunity.constants';

import { Notes } from '../../../../shared/components/notes/notes';
import { NextActionCard } from '../next-action-card/next-action-card';
import { SelectMenu } from '../../../../shared/components/select-menu/select-menu';
import { Timeline } from '../timeline/timeline';

import { CompanyTypePipe } from '../../../../shared/pipes/company-type-pipe';
import { DateFormatPipe } from '../../../../shared/pipes/date-format-pipe';
import { DurationUnitPipe } from '../../../../shared/pipes/duration-unit-pipe';
import { FallbackPipe } from '../../../../shared/pipes/fallback-pipe';
import { OpportunityModalityPipe } from '../../../../shared/pipes/opportunity-modality-pipe';
import { OpportunitySeniorityPipe } from '../../../../shared/pipes/opportunity-seniority-pipe';
import { TjmPipe } from '../../../../shared/pipes/tjm-pipe';
import { WorkloadPipe } from '../../../../shared/pipes/workload-pipe';

@Component({
  selector: 'app-opportunity-details-panel',

  standalone: true,

  imports: [
    CompanyTypePipe,
    DateFormatPipe,
    DurationUnitPipe,
    FallbackPipe,
    NextActionCard,
    Notes,
    OpportunityModalityPipe,
    OpportunitySeniorityPipe,
    ReactiveFormsModule,
    SelectMenu,
    Timeline,
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
    The requested terminal status is forwarded
    to the next action workflow.
  */
  readonly pendingStatus = input<OpportunityStatus | null>(null);

  readonly panelClose = output<void>();

  readonly statusChange = output<OpportunityStatus>();

  readonly eventAdd = output<{
    type: OpportunityEventType;
    comment?: string;
  }>();

  readonly eventUpdate = output<{
    eventId: string;
    type: OpportunityEventType;
    comment?: string;
  }>();

  readonly eventDelete = output<string>();

  readonly noteAdd = output<{
    title: string;
    content: string;
  }>();

  readonly noteUpdate = output<{
    noteId: string;
    title: string;
    content: string;
  }>();

  readonly noteDelete = output<string>();

  readonly nextActionUpdate = output<NextAction>();

  readonly nextActionComplete = output<void>();

  readonly nextActionCompleteForStatusChange = output<void>();

  readonly nextActionDeleteForStatusChange = output<void>();

  readonly statusChangeCancelled = output<void>();

  /*
    Opportunity edition remains controlled
    by the board container.
  */
  readonly edit = output<void>();

  readonly delete = output<void>();

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

  readonly confirmingDeletion = signal(false);

  private readonly formBuilder = inject(NonNullableFormBuilder);

  readonly statusForm = this.formBuilder.group({
    status: [''],
  });

  private copyFeedbackTimeout?: ReturnType<typeof setTimeout>;

  constructor() {
    effect(() => {
      this.statusForm.patchValue(
        {
          status: this.opportunity().status,
        },
        {
          emitEvent: false,
        },
      );
    });

    this.statusForm.controls.status.valueChanges.subscribe((status) => {
      if (!status || status === this.opportunity().status) {
        return;
      }

      this.statusChange.emit(status as OpportunityStatus);
    });
  }

  closePanel(): void {
    if (!this.canClose()) {
      return;
    }

    this.panelClose.emit();
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

  /*
    Open the opportunity edition workflow.
  */
  openEdition(): void {
    this.edit.emit();
  }

  confirmDeletion(): void {
    this.confirmingDeletion.set(true);
  }

  cancelDeletion(): void {
    this.confirmingDeletion.set(false);
  }

  deleteOpportunity(): void {
    this.delete.emit();

    this.confirmingDeletion.set(false);
  }
}
