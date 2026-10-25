import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, Subscription, of } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { 
  DeviceStatusEvent, 
  OrderInfo, 
  ProductionInterrupt, 
  TelemetryPoint 
} from '../../../core/models/app.models';
import { DeviceApiService } from '../../../core/services/device-api.service';
import { DeviceSseService } from '../../../core/services/device-sse.service';

export interface DashboardState {
  devices: string[];
  selectedDeviceId: string | null;
  currentStatus: 'running' | 'stopped' | 'maintenance';
  currentOrderId: string | null;
  orderInfo: OrderInfo | null;
  partsPerMinuteHistory: TelemetryPoint[];
  partsProducedHistory: TelemetryPoint[];
  interrupts: ProductionInterrupt[];
  isLoadingDevices: boolean;
}

const initialState: DashboardState = {
  devices: [],
  selectedDeviceId: null,
  currentStatus: 'running',
  currentOrderId: null,
  orderInfo: null,
  partsPerMinuteHistory: [],
  partsProducedHistory: [],
  interrupts: [],
  isLoadingDevices: false
};

@Injectable()
export class DashboardStore {
  private readonly deviceApi = inject(DeviceApiService);
  private readonly sseService = inject(DeviceSseService);

  private readonly stateSubject = new BehaviorSubject<DashboardState>(initialState);
  public readonly state$: Observable<DashboardState> = this.stateSubject.asObservable();

  private sseSubscription?: Subscription;
  private previousStatus: 'running' | 'stopped' | 'maintenance' = 'running';
  private totalPartsProducedCumulative: number = 0;
  private lastEventTimestamp: number = 0;

  public loadDevices(): void {
    this.updateState({ isLoadingDevices: true });
    this.deviceApi.getDevices().pipe(
      catchError(() => of([]))
    ).subscribe(devices => {
      this.updateState({ 
        devices, 
        isLoadingDevices: false 
      });

      // Auto-select first device if none selected
      if (devices.length > 0 && !this.stateSubject.value.selectedDeviceId) {
        this.selectDevice(devices[0]);
      }
    });
  }

  public selectDevice(deviceId: string): void {
    if (this.stateSubject.value.selectedDeviceId === deviceId) return;

    // Reset session histories when choosing a new device as per assignment:
    // "the historic parts per minute values since the device has been selected"
    // "the historic number of parts produced since the device has been selected"
    this.totalPartsProducedCumulative = 0;
    this.lastEventTimestamp = 0;
    this.previousStatus = 'running';

    this.updateState({
      selectedDeviceId: deviceId,
      partsPerMinuteHistory: [],
      partsProducedHistory: [],
      interrupts: [],
      orderInfo: null,
      currentOrderId: null
    });

    this.connectToDeviceStream(deviceId);
  }

  private connectToDeviceStream(deviceId: string): void {
    // Unsubscribe from previous SSE connection safely
    if (this.sseSubscription) {
      this.sseSubscription.unsubscribe();
    }

    this.sseSubscription = this.sseService.connect(deviceId).subscribe({
      next: (event: DeviceStatusEvent) => this.handleDeviceEvent(event),
      error: (err) => console.error('[DashboardStore] SSE error', err)
    });
  }

  private handleDeviceEvent(event: DeviceStatusEvent): void {
    const currentState = this.stateSubject.value;
    const now = new Date(event.timestamp);

    // 1. Telemetry: Parts Per Minute
    const newPpmPoint: TelemetryPoint = {
      timestamp: now,
      value: event.partsPerMinute
    };
    // Keep rolling history up to 40 data points
    const updatedPpm = [...currentState.partsPerMinuteHistory, newPpmPoint].slice(-40);

    // 2. Telemetry: Cumulative parts produced since device selection
    if (this.lastEventTimestamp > 0 && event.status === 'running') {
      const deltaMinutes = (event.timestamp - this.lastEventTimestamp) / 60000;
      const incrementalParts = event.partsPerMinute * Math.max(0, deltaMinutes);
      this.totalPartsProducedCumulative += incrementalParts;
    }
    this.lastEventTimestamp = event.timestamp;

    const newProducedPoint: TelemetryPoint = {
      timestamp: now,
      value: Math.round(this.totalPartsProducedCumulative)
    };
    const updatedProduced = [...currentState.partsProducedHistory, newProducedPoint].slice(-40);

    // 3. Track Interrupts (Transition from running -> stopped or maintenance)
    let updatedInterrupts = currentState.interrupts;
    if (event.status !== 'running' && this.previousStatus === 'running') {
      const newInterrupt: ProductionInterrupt = {
        id: Math.random().toString(36).substring(2, 9),
        deviceId: event.deviceId,
        timestamp: event.timestamp,
        status: event.status
      };
      updatedInterrupts = [newInterrupt, ...updatedInterrupts];
    }
    this.previousStatus = event.status;

    // 4. Update order details if order ID changed or is present
    if (event.order && event.order !== currentState.currentOrderId) {
      this.fetchOrderDetails(event.order);
    } else if (event.order && !currentState.orderInfo) {
      this.fetchOrderDetails(event.order);
    }

    this.updateState({
      currentStatus: event.status,
      currentOrderId: event.order,
      partsPerMinuteHistory: updatedPpm,
      partsProducedHistory: updatedProduced,
      interrupts: updatedInterrupts
    });
  }

  private fetchOrderDetails(orderId: string): void {
    // Hint: "Order information is only updated when there's a connection to the SSE endpoint"
    this.deviceApi.getOrder(orderId).pipe(
      catchError(() => of(null))
    ).subscribe(orderInfo => {
      if (orderInfo) {
        this.updateState({ orderInfo });
      }
    });
  }

  private updateState(partial: Partial<DashboardState>): void {
    this.stateSubject.next({
      ...this.stateSubject.value,
      ...partial
    });
  }

  public destroy(): void {
    if (this.sseSubscription) {
      this.sseSubscription.unsubscribe();
    }
  }
}
