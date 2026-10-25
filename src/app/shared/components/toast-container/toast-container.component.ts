import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../../core/notifications/notification.service';
import { AppNotification } from '../../../core/notifications/notification.model';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-wrapper" aria-live="polite">
      <div 
        *ngFor="let toast of notifications$ | async" 
        class="toast-card" 
        [ngClass]="'toast-' + toast.type"
      >
        <div class="toast-icon">
          <span *ngIf="toast.type === 'error'">⚠️</span>
          <span *ngIf="toast.type === 'warning'">⚡</span>
          <span *ngIf="toast.type === 'info'">ℹ️</span>
          <span *ngIf="toast.type === 'success'">✅</span>
        </div>
        <div class="toast-content">
          <div class="toast-title">{{ toast.title }}</div>
          <div class="toast-message">{{ toast.message }}</div>
          <div class="toast-time">{{ toast.timestamp | date:'HH:mm:ss' }}</div>
        </div>
        <button 
          *ngIf="toast.dismissible" 
          class="close-btn" 
          (click)="dismiss(toast.id)"
          aria-label="Close notification"
        >
          &times;
        </button>
      </div>
    </div>
  `,
  styles: [`
    .toast-wrapper {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 12px;
      max-width: 420px;
      pointer-events: none;
    }

    .toast-card {
      pointer-events: auto;
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 14px 16px;
      border-radius: 8px;
      background: #ffffff;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
      border-left: 5px solid transparent;
      animation: slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      transition: all 0.2s ease;
    }

    .toast-error {
      border-left-color: #ef4444;
      background: #fffafa;
    }

    .toast-warning {
      border-left-color: #f59e0b;
      background: #fffdf5;
    }

    .toast-info {
      border-left-color: #3b82f6;
      background: #f8faff;
    }

    .toast-success {
      border-left-color: #10b981;
      background: #f7fdfa;
    }

    .toast-icon {
      font-size: 1.25rem;
      line-height: 1;
      padding-top: 2px;
    }

    .toast-content {
      flex: 1;
    }

    .toast-title {
      font-weight: 700;
      font-size: 0.9rem;
      color: #1e293b;
      margin-bottom: 2px;
    }

    .toast-message {
      font-size: 0.82rem;
      color: #475569;
      line-height: 1.4;
    }

    .toast-time {
      font-size: 0.7rem;
      color: #94a3b8;
      margin-top: 4px;
    }

    .close-btn {
      background: transparent;
      border: none;
      font-size: 1.4rem;
      line-height: 1;
      color: #94a3b8;
      cursor: pointer;
      padding: 0 4px;
      transition: color 0.15s ease;
      &:hover {
        color: #334155;
      }
    }

    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateY(16px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `]
})
export class ToastContainerComponent {
  private readonly notificationService = inject(NotificationService);
  public readonly notifications$ = this.notificationService.notifications$;

  public dismiss(id: string): void {
    this.notificationService.dismiss(id);
  }
}
