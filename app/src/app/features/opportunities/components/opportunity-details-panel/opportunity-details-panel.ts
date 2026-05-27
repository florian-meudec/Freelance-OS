import { Component, computed, ElementRef, input, output, signal, viewChild } from '@angular/core';

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
    Note form visibility stays local to keep
    lightweight interactions inside the panel.
  */
  readonly showNoteForm = signal(false);

  /*
    Notes are created by the board container
    to centralize opportunity state mutations.
  */
  readonly noteAdd = output<{
    title: string;
    content: string;
  }>();

  /*
    Note form references support lightweight
    focus and scrolling interactions.
  */
  readonly noteForm = viewChild<ElementRef<HTMLDivElement>>('noteForm');

  readonly noteTitleInput = viewChild<ElementRef<HTMLInputElement>>('noteTitleInput');

  /*
    Inline note editing preserves context
    while keeping CRM interactions lightweight.
  */
  readonly editingNoteId = signal<string | null>(null);

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
    Note deletion confirmation prevents
    accidental destructive actions.
  */
  readonly deletingNoteId = signal<string | null>(null);

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
    Toggle lightweight note creation without
    leaving the current opportunity context.
  */
  toggleNoteForm(): void {
    this.editingNoteId.set(null);

    this.deletingNoteId.set(null);

    const nextValue = !this.showNoteForm();

    this.showNoteForm.set(nextValue);

    /*
      Wait for the form to render before
      applying scroll and focus interactions.
    */
    if (nextValue) {
      requestAnimationFrame(() => {
        this.noteForm()?.nativeElement.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
        });

        this.noteTitleInput()?.nativeElement.focus();
      });
    }
  }

  /*
    Emit note creation requests upward so the
    board container remains the source of truth.
  */
  addNote(title: string, content: string): void {
    this.noteAdd.emit({
      title,
      content,
    });

    this.showNoteForm.set(false);
  }

  /*
    Notes become editable directly inside
    the timeline context for faster workflows.
  */
  startNoteEdit(noteId: string): void {
    this.showNoteForm.set(false);

    this.editingNoteId.set(noteId);

    this.deletingNoteId.set(null);
  }

  /*
    Cancel inline editing and restore
    the compact CRM note presentation.
  */
  cancelNoteEdit(): void {
    this.editingNoteId.set(null);

    this.deletingNoteId.set(null);
  }

  /*
    Destructive actions require explicit
    confirmation to avoid accidental loss.
  */
  confirmNoteDelete(noteId: string): void {
    this.deletingNoteId.set(noteId);
  }

  /*
    Emit note updates upward so the board
    remains the single source of truth.
  */
  updateNote(noteId: string, title: string, content: string): void {
    this.noteUpdate.emit({
      noteId,
      title,
      content,
    });

    this.cancelNoteEdit();
  }

  /*
    Note deletions stay centralized to keep
    opportunity mutations consistent.
  */
  deleteNote(noteId: string): void {
    this.noteDelete.emit(noteId);

    this.cancelNoteEdit();
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
