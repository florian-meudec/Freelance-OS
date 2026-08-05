import {
  Component,
  computed,
  ElementRef,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { DateFormatPipe } from '../../pipes/date-format-pipe';

import { Note } from '../../models/note.model';
import { DiscardChangesModal } from '../discard-changes-modal/discard-changes-modal';
import { FormInteractionHandler } from '../../utils/form-interaction-handler';
import { notBlank } from '../../validator/not-blank.validator';
import { FormErrors } from '../form-error/form-errors';

@Component({
  selector: 'app-notes',

  standalone: true,

  imports: [DateFormatPipe, ReactiveFormsModule, DiscardChangesModal, FormErrors],

  templateUrl: './notes.html',

  styleUrl: './notes.scss',
})
export class Notes extends FormInteractionHandler {
  /*
    Shared notes remain reusable across
    multiple business entities and screens.
  */
  readonly notes = input.required<Note[]>();

  /*
    Notes are managed by parent containers
    to centralize business state mutations.
  */
  readonly noteAdd = output<{
    title: string;
    content: string;
  }>();

  /*
    Emit note updates to keep business
    state centralized in the parent.
  */
  readonly noteUpdate = output<{
    noteId: string;
    title: string;
    content: string;
  }>();

  /*
    Emit note deletion requests while
    preserving a single source of truth.
  */
  readonly noteDelete = output<string>();

  private readonly formBuilder = inject(NonNullableFormBuilder);

  /*
    Creation form stays isolated from
    inline edition interactions.
  */
  readonly creationForm = this.formBuilder.group({
    title: ['', [Validators.required, Validators.maxLength(100), notBlank()]],
    content: ['', [Validators.required, Validators.maxLength(5000), notBlank()]],
  });

  /*
    Edition form remains independent
    from note creation workflow.
  */
  readonly editionForm = this.formBuilder.group({
    title: ['', [Validators.required, Validators.maxLength(100), notBlank()]],
    content: ['', [Validators.required, Validators.maxLength(5000), notBlank()]],
  });

  /*
    Note form visibility stays local to keep
    lightweight interactions contextual.
  */
  readonly showNoteForm = signal(false);

  /*
    Inline note editing preserves density
    while keeping interactions intuitive.
  */
  readonly editingNoteId = signal<string | null>(null);

  /*
    Deletion confirmations prevent accidental
    destructive interactions.
  */
  readonly deletingNoteId = signal<string | null>(null);

  /*
    Form references support lightweight
    scroll and focus interactions.
  */
  readonly noteFormElement = viewChild<ElementRef<HTMLFormElement>>('noteForm');

  /*
    Notes are displayed newest first
    for faster contextual scanning.
  */
  readonly sortedNotes = computed(() =>
    [...this.notes()].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    ),
  );

  /*
    Open lightweight note creation without
    leaving the current business context.
  */
  openNoteForm(): void {
    if (
      this.editingNoteId() !== null &&
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
  requestCloseNoteForm(): void {
    this.executeOrConfirm(this.creationForm.dirty, () => this.closeNoteForm());
  }

  /*
    Emit note creation requests upward so the
    parent remains the source of truth.
  */
  addNote(): void {
    if (this.creationForm.invalid) {
      this.creationForm.markAllAsTouched();

      return;
    }

    this.noteAdd.emit(this.creationForm.getRawValue());

    this.closeNoteForm();
  }

  /*
    Notes become editable directly inside
    the timeline context for faster workflows.
  */
  startNoteEdit(note: Note): void {
    if (
      this.showNoteForm() &&
      !this.executeOrConfirm(this.creationForm.dirty, () => this.openEditionForm(note))
    ) {
      return;
    }

    if (
      this.editingNoteId() !== null &&
      this.editingNoteId() !== note.id &&
      !this.executeOrConfirm(this.editionForm.dirty, () => this.openEditionForm(note))
    ) {
      return;
    }

    this.openEditionForm(note);
  }

  /*
    Request edition cancellation while
    protecting unsaved modifications.
  */
  requestCancelNoteEdit(): void {
    this.executeOrConfirm(this.editionForm.dirty, () => this.cancelNoteEdit());
  }

  /*
    Emit note updates upward so the parent
    remains the source of truth.
  */
  updateNote(noteId: string): void {
    if (this.editionForm.invalid) {
      this.editionForm.markAllAsTouched();

      return;
    }

    this.noteUpdate.emit({
      noteId,
      ...this.editionForm.getRawValue(),
    });

    this.cancelNoteEdit();
  }

  /*
    Destructive actions require explicit
    confirmation to avoid accidental loss.
  */
  confirmNoteDelete(noteId: string): void {
    this.deletingNoteId.set(noteId);
  }

  /*
    Cancel deletion confirmation while
    preserving the current edition state.
  */
  cancelNoteDelete(): void {
    this.deletingNoteId.set(null);
  }

  /*
    Note deletions stay centralized to keep
    business state synchronized.
  */
  deleteNote(noteId: string): void {
    this.noteDelete.emit(noteId);

    this.cancelNoteEdit();
  }

  /*
    Initialize the creation workflow
    and focus the first editable field.
  */
  private openCreationForm(): void {
    this.editingNoteId.set(null);

    this.deletingNoteId.set(null);

    this.creationForm.reset();

    this.showNoteForm.set(true);

    requestAnimationFrame(() => {
      const form = this.noteFormElement()?.nativeElement;

      form?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });

      form?.querySelector<HTMLInputElement>('input')?.focus();
    });
  }

  /*
    Close the creation workflow and
    restore its initial state.
  */
  private closeNoteForm(): void {
    this.creationForm.reset();

    this.showNoteForm.set(false);
  }

  /*
    Initialize inline edition from
    the selected note.
  */
  private openEditionForm(note: Note): void {
    this.showNoteForm.set(false);

    this.editingNoteId.set(note.id);

    this.deletingNoteId.set(null);

    this.editionForm.reset({
      title: note.title,
      content: note.content,
    });
  }

  /*
    Cancel inline editing and restore
    compact note presentation.
  */
  cancelNoteEdit(): void {
    this.editingNoteId.set(null);

    this.deletingNoteId.set(null);

    this.editionForm.reset();
  }
}
