import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../../core/notifications/notification.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast-container.component.html',
  styleUrls: ['./toast-container.component.scss']
})
export class ToastContainerComponent {
  private readonly notificationService = inject(NotificationService);
  public readonly notifications$ = this.notificationService.notifications$;

  public dismiss(id: string): void {
    this.notificationService.dismiss(id);
  }
}
