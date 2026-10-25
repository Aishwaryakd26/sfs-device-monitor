import { Injectable, inject, NgZone } from '@angular/core';
import { Observable } from 'rxjs';
import { RuntimeConfigService } from '../config/runtime-config.service';
import { DeviceStatusEvent } from '../models/app.models';
import { NotificationService } from '../notifications/notification.service';

@Injectable({
  providedIn: 'root'
})
export class DeviceSseService {
  private readonly configService = inject(RuntimeConfigService);
  private readonly notificationService = inject(NotificationService);
  private readonly zone = inject(NgZone);

  public connect(deviceId: string): Observable<DeviceStatusEvent> {
    const url = this.configService.resolveUrl('events', { deviceId });

    return new Observable<DeviceStatusEvent>(observer => {
      let eventSource: EventSource | null = null;
      let isClosed = false;

      const initConnection = () => {
        if (isClosed) return;
        
        try {
          eventSource = new EventSource(url);

          eventSource.onopen = () => {
            console.log(`[SSE] Connected to device events stream: ${deviceId}`);
          };

          eventSource.onmessage = (event: MessageEvent) => {
            try {
              const data: DeviceStatusEvent = JSON.parse(event.data);
              // Run inside Angular zone so bindings update predictably
              this.zone.run(() => observer.next(data));
            } catch (err) {
              console.error('[SSE] Failed to parse event JSON', err);
            }
          };

          eventSource.onerror = (err) => {
            console.warn(`[SSE] Stream disconnected or encountered error for device ${deviceId}`, err);
            // Non-fatal SSE disconnect: browser EventSource automatically retries,
            // but we alert the user if core service error occurs
            this.zone.run(() => {
              this.notificationService.notifyWarning(
                'Stream Interrupted',
                `Real-time telemetry connection for device #${deviceId} experienced a disconnect. Reconnecting...`
              );
            });
          };
        } catch (err) {
          this.zone.run(() => observer.error(err));
        }
      };

      initConnection();

      // Teardown logic when switched or unsubscribed
      return () => {
        isClosed = true;
        if (eventSource) {
          console.log(`[SSE] Closing connection for device: ${deviceId}`);
          eventSource.close();
          eventSource = null;
        }
      };
    });
  }
}
