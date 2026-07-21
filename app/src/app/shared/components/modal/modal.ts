import { Component, HostListener, input, output } from '@angular/core';

@Component({
  selector: 'app-modal',

  standalone: true,

  templateUrl: './modal.html',

  styleUrl: './modal.scss',
})
export class Modal {
  /*
    Notify the parent when the modal
    should be closed.
  */
  readonly closed = output<void>();

  /*
    Configure the modal width preset.
  */
  readonly size = input<'small' | 'medium' | 'large'>('large');

  /*
    Request closing the modal through
    the backdrop interaction.
  */
  requestClose(): void {
    this.closed.emit();
  }

  /*
    Close the modal when Escape is pressed.
  */
  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closed.emit();
  }
}
