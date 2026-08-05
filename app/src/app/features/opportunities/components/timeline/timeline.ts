import { Component, computed, inject, input, output, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { DiscardChangesModal } from '../../../../shared/components/discard-changes-modal/discard-changes-modal';
import { SelectMenu } from '../../../../shared/components/select-menu/select-menu';
import { DateFormatPipe } from '../../../../shared/pipes/date-format-pipe';
import { FormInteractionHandler } from '../../../../shared/utils/form-interaction-handler';

import {
  OPPORTUNITY_EVENT_TYPES,
  OPPORTUNITY_STATUSES,
} from '../../constants/opportunity.constants';
import { OpportunityEvent } from '../../models/opportunity-event.model';
import { OpportunityEventType } from '../../types/opportunity.type';

@Component({
  selector: 'app-timeline',

  standalone: true,

  imports: [DateFormatPipe, ReactiveFormsModule, SelectMenu, DiscardChangesModal],

  templateUrl: './timeline.html',

  styleUrl: './timeline.scss',
})
export class Timeline extends FormInteractionHandler {
  readonly events = input.required<OpportunityEvent[]>();

  readonly add = output<{
    type: OpportunityEvent['type'];
    occurredAt: string;
    comment?: string;
  }>();

  readonly update = output<{
    eventId: string;
    type: OpportunityEvent['type'];
    occurredAt: string;
    comment?: string;
  }>();

  readonly delete = output<string>();

  /*
    Only user-generated event types are exposed
    through the manual timeline workflow.
  */
  readonly manualEventTypes = [
    OPPORTUNITY_EVENT_TYPES.CALL,
    OPPORTUNITY_EVENT_TYPES.EMAIL,
    OPPORTUNITY_EVENT_TYPES.MEETING,
  ];

  private readonly formBuilder = inject(NonNullableFormBuilder);

  readonly creationForm = this.formBuilder.group({
    type: this.formBuilder.control<OpportunityEventType>(
      this.manualEventTypes[0].value,
      Validators.required,
    ),

    occurredAt: this.formBuilder.control(this.getCurrentDate(), Validators.required),

    comment: ['', Validators.maxLength(5000)],
  });

  readonly editionForm = this.formBuilder.group({
    type: this.formBuilder.control<OpportunityEventType>(
      this.manualEventTypes[0].value,
      Validators.required,
    ),

    occurredAt: this.formBuilder.control(this.getCurrentDate(), Validators.required),

    comment: ['', Validators.maxLength(5000)],
  });

  /*
    Timeline events are sorted from newest
    to oldest to prioritize recent activity.
  */
  readonly sortedEvents = computed(() =>
    [...this.events()].sort(
      (a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime(),
    ),
  );

  /*
    Timeline interaction state stays local
    to preserve lightweight editing workflows.
  */
  readonly showEventForm = signal(false);

  readonly editingEventId = signal<string | null>(null);

  readonly deletingEventId = signal<string | null>(null);

  /*
    Timeline events can be created directly
    from the opportunity workflow.
  */
  openEventForm(): void {
    if (
      this.editingEventId() !== null &&
      !this.executeOrConfirm(this.editionForm.dirty, () => this.openCreationForm())
    ) {
      return;
    }

    this.openCreationForm();
  }

  /*
    Request creation form closure while
    protecting unsaved modifications.
  */
  requestCloseEventForm(): void {
    this.executeOrConfirm(this.creationForm.dirty, () => this.closeCreationForm());
  }

  /*
    Event creation requests are emitted upward
    so workflow history remains centralized.
  */
  addEvent(): void {
    if (this.creationForm.invalid) {
      this.creationForm.markAllAsTouched();

      return;
    }

    const { type, occurredAt, comment } = this.creationForm.getRawValue();

    this.add.emit({
      type,
      occurredAt,
      comment: comment || undefined,
    });

    this.closeCreationForm();
  }

  /*
    Timeline events can be edited directly
    from the opportunity history.
  */
  startEventEdit(event: OpportunityEvent): void {
    if (
      this.showEventForm() &&
      !this.executeOrConfirm(this.creationForm.dirty, () => this.openEditionForm(event))
    ) {
      return;
    }

    if (
      this.editingEventId() !== null &&
      this.editingEventId() !== event.id &&
      !this.executeOrConfirm(this.editionForm.dirty, () => this.openEditionForm(event))
    ) {
      return;
    }

    this.openEditionForm(event);
  }

  /*
    Request edition cancellation while
    protecting unsaved modifications.
  */
  requestCancelEventEdit(): void {
    this.executeOrConfirm(this.editionForm.dirty, () => this.closeEditionForm());
  }

  /*
    Event updates are emitted upward so the
    parent remains the source of truth.
  */
  updateEvent(eventId: string): void {
    if (this.editionForm.invalid) {
      this.editionForm.markAllAsTouched();

      return;
    }

    const { type, occurredAt, comment } = this.editionForm.getRawValue();

    this.update.emit({
      eventId,
      type,
      occurredAt,
      comment: comment || undefined,
    });

    this.closeEditionForm();
  }

  /*
    Destructive actions require explicit
    confirmation to avoid accidental loss.
  */
  confirmEventDelete(eventId: string): void {
    this.deletingEventId.set(eventId);
  }

  /*
    Cancel deletion confirmation while
    preserving the current edition state.
  */
  cancelEventDelete(): void {
    this.deletingEventId.set(null);
  }

  /*
    Event deletions stay centralized to keep
    business state synchronized.
  */
  deleteEvent(eventId: string): void {
    this.delete.emit(eventId);

    this.cancelEventDelete();

    this.closeEditionForm();
  }

  /*
    Only manually created events may
    be edited from the timeline.
  */
  isEditableEvent(event: OpportunityEvent): boolean {
    return this.manualEventTypes.some((eventType) => eventType.value === event.type);
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
    Initialize the creation workflow
    with its default state.
  */
  private openCreationForm(): void {
    this.deletingEventId.set(null);

    this.editingEventId.set(null);

    this.creationForm.reset({
      type: this.manualEventTypes[0].value,
      occurredAt: this.getCurrentDate(),
      comment: '',
    });

    this.showEventForm.set(true);
  }

  /*
    Close inline creation and restore
    the default creation state.
  */
  private closeCreationForm(): void {
    this.deletingEventId.set(null);

    this.creationForm.reset({
      type: this.manualEventTypes[0].value,
      occurredAt: this.getCurrentDate(),
      comment: '',
    });

    this.showEventForm.set(false);
  }

  /*
    Initialize inline edition from
    the selected timeline event.
  */
  private openEditionForm(event: OpportunityEvent): void {
    this.showEventForm.set(false);

    this.editingEventId.set(event.id);

    this.deletingEventId.set(null);

    this.editionForm.reset({
      type: event.type,
      occurredAt: event.occurredAt,
      comment: event.comment ?? '',
    });
  }

  /*
    Cancel inline editing and restore
    the compact timeline presentation.
  */
  private closeEditionForm(): void {
    this.editingEventId.set(null);

    this.deletingEventId.set(null);

    this.editionForm.reset({
      type: this.manualEventTypes[0].value,
      occurredAt: this.getCurrentDate(),
      comment: '',
    });
  }

  /*
    Generate today's date
    for date form controls.
  */
  private getCurrentDate(): string {
    return new Date().toISOString().split('T')[0];
  }
}
