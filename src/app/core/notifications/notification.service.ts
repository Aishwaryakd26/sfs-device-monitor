import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AppNotification } from './notification.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private readonly notificationsSubject = new BehaviorSubject<AppNotification[]>([]);
  public readonly notifications$: Observable<AppNotification[]> = this.notificationsSubject.asObservable();

  public notifyError(title: string, message: string): void {
    this.addNotification({
      id: Math.random().toString(36).substring(2, 9),
      type: 'error',
      title,
      message,
      timestamp: new Date(),
      dismissible: true
    });
  }

  public notifyWarning(title: string, message: string): void {
    this.addNotification({
      id: Math.random().toString(36).substring(2, 9),
      type: 'warning',
      title,
      message,
      timestamp: new Date(),
      dismissible: true
    });
  }

  public notifyInfo(title: string, message: string): void {
    this.addNotification({
      id: Math.random().toString(36).substring(2, 9),
      type: 'info',
      title,
      message,
      timestamp: new Date(),
      dismissible: true
    });
  }

  public dismiss(id: string): void {
    const current = this.notificationsSubject.value.filter(n => n.id !== id);
    this.notificationsSubject.next(current);
  }

  private addNotification(notification: AppNotification): void {
    const current = this.notificationsSubject.value;
    // Keep max 5 most recent notifications
    this.notificationsSubject.next([notification, ...current].slice(0, 5));

    // Auto-dismiss errors after 8 seconds, warnings/info after 5 seconds
    const timeoutMs = notification.type === 'error' ? 8000 : 5000;
    setTimeout(() => {
      this.dismiss(notification.id);
    }, timeoutMs);
  }
}
