import { Component, output, signal } from '@angular/core';

@Component({
  selector: 'notifications-component',
  imports: [],
  templateUrl: './notifications.component.html',
})
export class NotificationsComponent {
  close = output<void>()

  closeModal() {
    this.close.emit();
  }
}
