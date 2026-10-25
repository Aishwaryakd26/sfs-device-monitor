export type NotificationType = 'error' | 'warning' | 'info' | 'success';

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  dismissible?: boolean;
}
