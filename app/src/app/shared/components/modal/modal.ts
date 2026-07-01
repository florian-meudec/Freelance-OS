import { Component, HostListener, input, output } from '@angular/core';

@Component({
  selector: 'app-modal',

  standalone: true,

  templateUrl: './modal.html',

  styleUrl: './modal.scss',
})
export class Modal {
  readonly closed = output<void>();

  readonly size = input<'small' | 'medium' | 'large'>('large');

  requestClose(): void {
    this.closed.emit();
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closed.emit();
  }
}
