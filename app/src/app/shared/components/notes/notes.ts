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

@Component({
  selector: 'app-notes',

  standalone: true,

  imports: [DateFormatPipe, ReactiveFormsModule],

  templateUrl: './notes.html',

  styleUrl: './notes.scss',
})
export class Notes {
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

  readonly noteUpdate = output<{
    noteId: string;
    title: string;
    content: string;
  }>();

  readonly noteDelete = output<string>();

  private readonly formBuilder = inject(NonNullableFormBuilder);

  readonly creationForm = this.formBuilder.group({
    title: ['', Validators.required],
    content: ['', Validators.required],
  });

  readonly editionForm = this.formBuilder.group({
    title: ['', Validators.required],
    content: ['', Validators.required],
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
    this.editingNoteId.set(null);

    this.deletingNoteId.set(null);

    this.creationForm.reset();

    this.showNoteForm.set(true);

    requestAnimationFrame(() => {
      this.noteFormElement()?.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });

      this.noteFormElement()?.nativeElement.querySelector<HTMLInputElement>('input')?.focus();
    });
  }

  /*
    Close the creation workflow and
    restore its initial state.
  */
  closeNoteForm(): void {
    this.creationForm.reset();

    this.showNoteForm.set(false);
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
    this.showNoteForm.set(false);

    this.deletingNoteId.set(null);

    this.editingNoteId.set(note.id);

    this.editionForm.reset();

    this.editionForm.patchValue({
      title: note.title,
      content: note.content,
    });
  }

  /*
    Cancel inline editing and restore
    compact note presentation.
  */
  cancelNoteEdit(): void {
    this.editionForm.reset();

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
    Note deletions stay centralized to keep
    business state synchronized.
  */
  deleteNote(noteId: string): void {
    this.noteDelete.emit(noteId);

    this.cancelNoteEdit();
  }
}
