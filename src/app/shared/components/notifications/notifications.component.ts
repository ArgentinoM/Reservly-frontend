import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';

type AlertType = 'success' | 'error';

@Component({
  selector: 'notifications-component',
  imports: [CommonModule],
  templateUrl: './notifications.component.html',
})
export class NotificationsComponent {
  close = output<void>();
  type = input.required<AlertType>();
  message = input.required<string>();

  get colorClass(): string {
    switch (this.type()) {
      case 'success': return 'text-success';
      case 'error': return 'text-error';
      default: return 'text-primary';
    }
  }


  get bgClass(): string {
    switch (this.type()) {
      case 'success': return 'bg-success/10';
      case 'error': return 'bg-error/10';
      default: return 'bg-primary/10';
    }
  }

  get title(): string {
    switch (this.type()) {
      case 'success': return '¡Éxito!';
      case 'error': return '¡Error!';
      default: return '';
    }
  }

  get icon(): string {
    switch (this.type()) {
      case 'success': return 'fa-check';
      case 'error': return 'fa-xmark';
      default: return 'fa-circle';
    }
  }

  closeModal() {
    this.close.emit();
  }
}
