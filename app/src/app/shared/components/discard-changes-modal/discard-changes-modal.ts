import { Component, output } from '@angular/core';

import { Modal } from '../modal/modal';

@Component({
  selector: 'app-discard-changes-modal',

  standalone: true,

  imports: [Modal],

  templateUrl: './discard-changes-modal.html',

  styleUrl: './discard-changes-modal.scss',
})
export class DiscardChangesModal {
  /*
    Continue editing the current form.
  */
  readonly cancelled = output<void>();

  /*
    Discard all pending changes.
  */
  readonly confirmed = output<void>();

  /*
    Keep the current edition workflow active.
  */
  cancel(): void {
    this.cancelled.emit();
  }

  /*
    Confirm discarding all pending changes.
  */
  confirm(): void {
    this.confirmed.emit();
  }
}
