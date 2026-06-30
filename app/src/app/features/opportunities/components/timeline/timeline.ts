import { Component, computed, inject, input, output, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { DateFormatPipe } from '../../../../shared/pipes/date-format-pipe';
import { SelectMenu } from '../../../../shared/components/select-menu/select-menu';

import { OpportunityEvent } from '../../models/opportunity-event.model';
import { OpportunityEventType } from '../../types/opportunity.type';

import {
  OPPORTUNITY_EVENT_TYPES,
  OPPORTUNITY_STATUSES,
} from '../../constants/opportunity.constants';

@Component({
  selector: 'app-timeline',

  standalone: true,

  imports: [DateFormatPipe, ReactiveFormsModule, SelectMenu],

  templateUrl: './timeline.html',

  styleUrl: './timeline.scss',
})
export class Timeline {
  readonly events = input.required<OpportunityEvent[]>();

  readonly add = output<{
    type: OpportunityEvent['type'];
    comment?: string;
  }>();

  readonly update = output<{
    eventId: string;
    type: OpportunityEvent['type'];
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

  readonly form = this.formBuilder.group({
    type: this.formBuilder.control<OpportunityEventType>(
      this.manualEventTypes[0].value,
      Validators.required,
    ),

    comment: [''],
  });

  /*
    Timeline events are sorted from newest
    to oldest to prioritize recent activity.
  */
  readonly sortedEvents = computed(() =>
    [...this.events()].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
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
  toggleEventForm(): void {
    if (this.showEventForm()) {
      this.closeEventForm();

      return;
    }

    this.editingEventId.set(null);

    this.showEventForm.set(true);
  }

  /*
    Close inline creation and restore
    the default creation state.
  */
  closeEventForm(): void {
    this.showEventForm.set(false);

    this.form.reset({
      type: this.manualEventTypes[0].value,
      comment: '',
    });
  }

  /*
    Event creation requests are emitted upward
    so workflow history remains centralized.
  */
  addEvent(): void {
    const { type, comment } = this.form.getRawValue();

    this.add.emit({
      type,
      comment: comment || undefined,
    });

    this.closeEventForm();
  }

  /*
    Timeline events can be edited directly
    from the opportunity history.
  */
  startEventEdit(event: OpportunityEvent): void {
    this.closeEventForm();

    this.form.reset({
      type: event.type,
      comment: event.comment ?? '',
    });

    this.editingEventId.set(event.id);
  }

  /*
    Event updates are emitted upward so the
    parent remains the source of truth.
  */
  updateEvent(eventId: string): void {
    const { type, comment } = this.form.getRawValue();

    this.update.emit({
      eventId,
      type,
      comment: comment || undefined,
    });

    this.cancelEventEdit();
  }

  /*
    Cancel inline editing and restore
    the compact timeline presentation.
  */
  cancelEventEdit(): void {
    this.deletingEventId.set(null);

    this.editingEventId.set(null);

    this.form.reset({
      type: this.manualEventTypes[0].value,
      comment: '',
    });
  }

  confirmEventDelete(eventId: string): void {
    this.deletingEventId.set(eventId);
  }

  /*
    Cancel deletion confirmation while
    preserving the current edit state.
  */
  cancelEventDelete(): void {
    this.deletingEventId.set(null);
  }

  deleteEvent(eventId: string): void {
    this.delete.emit(eventId);

    this.cancelEventDelete();

    this.cancelEventEdit();
  }

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
}
