import { Component, HostListener, output } from '@angular/core';

@Component({
  selector: 'app-modal',

  standalone: true,

  templateUrl: './modal.html',

  styleUrl: './modal.scss',
})
export class Modal {
  readonly closed = output<void>();

  requestClose(): void {
    this.closed.emit();
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closed.emit();
  }
}
