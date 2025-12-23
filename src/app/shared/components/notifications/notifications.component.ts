import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';

type AlertType = 'success' | 'error' | 'warning';

@Component({
  selector: 'notifications-component',
  imports: [CommonModule],
  templateUrl: './notifications.component.html',
})
export class NotificationsComponent {
  close = output<void>();
  confirm = output<void>();
  type = input.required<AlertType>();
  message = input.required<string>();

  get colorClass(): string {
    switch (this.type()) {
      case 'success': return 'text-success';
      case 'error': return 'text-error';
      case 'warning': return 'text-warning';
      default: return 'text-primary';
    }
  }


  get bgClass(): string {
    switch (this.type()) {
      case 'success': return 'bg-success/10';
      case 'error': return 'bg-error/10';
      case 'warning': return 'bg-warning/10';
      default: return 'bg-primary/10';
    }
  }

  get title(): string {
    switch (this.type()) {
      case 'success': return '¡Éxito!';
      case 'error': return '¡Error!';
      case 'warning': return '¡Advertencia!';
      default: return '';
    }
  }

  get icon(): string {
    switch (this.type()) {
      case 'success': return 'fa-check';
      case 'error': return 'fa-xmark';
      case 'warning': return 'fa-triangle-exclamation';
      default: return 'fa-circle';
    }
  }

  closeModal() {
    this.close.emit();
  }

  confirmAction() {
    this.confirm.emit();
  }
}
