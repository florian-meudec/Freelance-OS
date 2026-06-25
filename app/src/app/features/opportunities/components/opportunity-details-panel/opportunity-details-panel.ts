import { Component, computed, input, output, signal, viewChild } from '@angular/core';

import { Opportunity, OpportunityStatus } from '../../models/opportunity.model';

import { Notes } from '../../../../shared/components/notes/notes';

import { CompanyTypePipe } from '../../../../shared/pipes/company-type-pipe';
import { DurationUnitPipe } from '../../../../shared/pipes/duration-unit-pipe';
import { DateFormatPipe } from '../../../../shared/pipes/date-format-pipe';
import { OpportunityModalityPipe } from '../../../../shared/pipes/opportunity-modality-pipe';
import { OpportunitySeniorityPipe } from '../../../../shared/pipes/opportunity-seniority-pipe';
import { TjmPipe } from '../../../../shared/pipes/tjm-pipe';
import { WorkloadPipe } from '../../../../shared/pipes/workload-pipe';
import { OpportunityEvent, OpportunityEventType } from '../../models/opportunity-event.model';
import {
  OPPORTUNITY_EVENT_TYPES,
  OPPORTUNITY_STATUSES,
} from '../../constants/opportunity.constants';
import { NextAction } from '../../models/next-action.model';

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
    Status options are generated directly from
    business constants to preserve consistency.
  */
  readonly statuses = Object.values(OPPORTUNITY_STATUSES);

  /*
    Only user-generated event types are exposed
    through the manual timeline workflow.
  */
  readonly manualEventTypes = [
    OPPORTUNITY_EVENT_TYPES.CALL,
    OPPORTUNITY_EVENT_TYPES.EMAIL,
    OPPORTUNITY_EVENT_TYPES.MEETING,
  ];

  /*
    Status menu visibility is handled locally
    to keep workflow interactions lightweight.
  */
  readonly showStatusMenu = signal(false);

  readonly notesComponent = viewChild(Notes);

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
    Event updates are delegated upward
    to centralize state mutations.
  */
  readonly eventUpdate = output<{
    eventId: string;
    type: OpportunityEventType;
    comment?: string;
  }>();

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
    Lightweight timeline event creation
    stays contextual inside the panel.
  */
  readonly showEventForm = signal(false);

  readonly showEventTypeSelector = signal(false);

  readonly currentEventType = signal<OpportunityEventType>(OPPORTUNITY_EVENT_TYPES.CALL.value);

  /*
    Inline event editing preserves context
    while keeping timeline interactions lightweight.
  */
  readonly editingEventId = signal<string | null>(null);

  readonly selectedEventTypeLabel = computed(
    () =>
      this.manualEventTypes.find((eventType) => eventType.value === this.currentEventType())
        ?.label ?? '',
  );

  readonly eventDelete = output<string>();

  readonly deletingEventId = signal<string | null>(null);

  readonly currentNextActionType = signal<OpportunityEventType>(this.manualEventTypes[0].value);

  readonly showNextActionTypeSelector = signal(false);

  readonly nextActionUpdate = output<NextAction>();

  readonly currentNextActionTypeLabel = computed(
    () =>
      this.manualEventTypes.find((eventType) => eventType.value === this.currentNextActionType())
        ?.label ?? '',
  );

  readonly nextActionComplete = output<void>();

  readonly nextActionMode = signal<NextActionMode>('view');

  closePanel(): void {
    this.panelClose.emit();
  }

  toggleStatusMenu(): void {
    this.showStatusMenu.update((value) => !value);
  }

  /*
    Timeline events can be created directly
    from the opportunity workflow.
  */
  toggleEventForm(): void {
    this.editingEventId.set(null);

    const nextValue = !this.showEventForm();

    this.showEventForm.set(nextValue);

    if (!nextValue) {
      this.currentEventType.set(this.manualEventTypes[0].value);
      this.showEventTypeSelector.set(false);
    }
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

  /*
    Quick actions can directly trigger
    contextual note creation workflows.
  */
  openQuickNoteForm(): void {
    this.notesComponent()?.openNoteForm();
  }

  /*
    Event creation requests are emitted upward
    so workflow history remains centralized.
  */
  addEvent(type: OpportunityEventType, comment?: string): void {
    this.eventAdd.emit({
      type,
      comment,
    });

    this.currentEventType.set(this.manualEventTypes[0].value);
    this.showEventTypeSelector.set(false);

    this.showEventForm.set(false);
  }

  selectEventType(type: OpportunityEventType): void {
    this.currentEventType.set(type);

    this.showEventTypeSelector.set(false);
  }

  toggleEventTypeMenu(): void {
    this.showEventTypeSelector.update((value) => !value);
  }

  /*
    Timeline events can be edited directly
    from the opportunity history.
  */
  startEventEdit(event: OpportunityEvent): void {
    this.showEventForm.set(false);

    this.showEventTypeSelector.set(false);

    this.currentEventType.set(event.type);

    this.editingEventId.set(event.id);
  }

  /*
    Cancel inline editing and restore
    the compact timeline presentation.
  */
  cancelEventEdit(): void {
    this.deletingEventId.set(null);

    this.editingEventId.set(null);
  }

  /*
    Event updates are emitted upward so the
    parent remains the source of truth.
  */
  updateEvent(eventId: string, type: OpportunityEventType, comment?: string): void {
    this.eventUpdate.emit({
      eventId,
      type,
      comment,
    });

    this.cancelEventEdit();
  }

  isEditableEvent(event: OpportunityEvent): boolean {
    return this.manualEventTypes.some((eventType) => eventType.value === event.type);
  }

  confirmEventDelete(eventId: string): void {
    this.deletingEventId.set(eventId);
  }

  cancelEventDelete(): void {
    this.deletingEventId.set(null);
  }

  deleteEvent(eventId: string): void {
    this.eventDelete.emit(eventId);

    this.deletingEventId.set(null);

    this.cancelEventEdit();
  }

  /*
    The next action card supports several
    workflow modes while sharing the same UI.
  */
  openNextAction(mode: NextActionMode): void {
    this.showNextActionTypeSelector.set(false);

    this.nextActionMode.set(mode);

    const nextAction = this.opportunity().nextAction;

    if (mode === 'edit' && nextAction) {
      this.currentNextActionType.set(nextAction.type);
    } else {
      this.currentNextActionType.set(this.manualEventTypes[0].value);
    }
  }

  closeNextAction(): void {
    this.nextActionMode.set('view');
    this.showNextActionTypeSelector.set(false);
  }

  selectNextActionType(type: OpportunityEventType): void {
    this.currentNextActionType.set(type);

    this.showNextActionTypeSelector.set(false);
  }

  toggleNextActionTypeMenu(): void {
    this.showNextActionTypeSelector.update((value) => !value);
  }

  saveNextAction(label: string, dueDate: string): void {
    this.nextActionUpdate.emit({
      type: this.currentNextActionType(),
      label,
      dueDate,
    });

    this.closeNextAction();
  }

  completeNextAction(): void {
    this.nextActionComplete.emit();

    this.openNextAction('create');
  }
}
