import { Component, computed, ElementRef, input, output, signal, viewChild } from '@angular/core';

import { DateFormatPipe } from '../../pipes/date-format-pipe';

import { Note } from '../../models/note.model';

@Component({
  selector: 'app-notes',

  standalone: true,

  imports: [DateFormatPipe],

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
  readonly noteForm = viewChild<ElementRef<HTMLDivElement>>('noteForm');

  readonly noteTitleInput = viewChild<ElementRef<HTMLInputElement>>('noteTitleInput');

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
    Toggle lightweight note creation without
    leaving the current business context.
  */
  toggleNoteForm(): void {
    this.editingNoteId.set(null);

    this.deletingNoteId.set(null);

    const nextValue = !this.showNoteForm();

    this.showNoteForm.set(nextValue);

    /*
      Wait for the form to render before
      applying focus interactions.
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
    parent remains the source of truth.
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
    compact note presentation.
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
    Emit note updates upward so the parent
    remains the source of truth.
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
    business state synchronized.
  */
  deleteNote(noteId: string): void {
    this.noteDelete.emit(noteId);

    this.cancelNoteEdit();
  }

  /*
    Public trigger allows external quick actions
    to open the lightweight note workflow.
  */
  openNoteForm(): void {
    if (!this.showNoteForm()) {
      this.toggleNoteForm();
    }
  }
}
