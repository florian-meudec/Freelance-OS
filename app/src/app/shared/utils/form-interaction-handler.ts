import { signal } from '@angular/core';

type PendingAction = () => void;

export abstract class FormInteractionHandler {
  /*
    Unsaved changes confirmation remains
    shared across reusable form workflows.
  */
  readonly showDiscardChangesModal = signal(false);

  /*
    Store the pending user action until
    the discard decision is resolved.
  */
  private readonly pendingAction = signal<PendingAction | null>(null);

  /*
    Execute the requested action immediately
    or ask for confirmation if changes exist.
  */
  protected executeOrConfirm(isDirty: boolean, action: () => void): boolean {
    if (!isDirty) {
      action();

      return true;
    }

    this.pendingAction.set(action);

    this.showDiscardChangesModal.set(true);

    return false;
  }

  /*
    Discard pending changes and continue
    with the originally requested action.
  */
  confirmDiscardChanges(): void {
    this.showDiscardChangesModal.set(false);

    const pendingAction = this.pendingAction();

    this.pendingAction.set(null);

    pendingAction?.();
  }

  /*
    Keep the current edition and discard
    the pending user action.
  */
  cancelDiscardChanges(): void {
    this.pendingAction.set(null);

    this.showDiscardChangesModal.set(false);
  }
}
