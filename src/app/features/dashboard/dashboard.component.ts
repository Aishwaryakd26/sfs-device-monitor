import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardStore } from './state/dashboard.store';
import { DevicePickerComponent } from './components/device-picker/device-picker.component';
import { DeviceOverviewComponent } from './components/device-overview/device-overview.component';
import { InterruptLogComponent } from './components/interrupt-log/interrupt-log.component';
import { LineChartComponent } from '../../shared/d3-charts/line-chart/line-chart.component';
import { ProgressGaugeComponent } from '../../shared/d3-charts/progress-gauge/progress-gauge.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  providers: [DashboardStore],
  imports: [
    CommonModule,
    DevicePickerComponent,
    DeviceOverviewComponent,
    InterruptLogComponent,
    LineChartComponent,
    ProgressGaugeComponent
  ],
  template: `
    <div class="dashboard-container" *ngIf="state$ | async as state">
      <!-- Device Selector -->
      <app-device-picker
        [devices]="state.devices"
        [selectedDeviceId]="state.selectedDeviceId"
        (deviceSelected)="onDeviceSelected($event)"
      ></app-device-picker>

      <!-- Active Device Banner & Status Hint -->
      <app-device-overview
        *ngIf="state.selectedDeviceId"
        [deviceId]="state.selectedDeviceId"
        [status]="state.currentStatus"
      ></app-device-overview>

      <!-- Main Visualizations Grid -->
      <div class="metrics-grid" *ngIf="state.selectedDeviceId">
        <!-- Historic Parts Per Minute Chart -->
        <div class="grid-item">
          <app-line-chart
            [data]="state.partsPerMinuteHistory"
            [title]="'Historic Parts Per Minute'"
            [unit]="'ppm'"
            [strokeColor]="'#2563eb'"
            [fillColor]="'rgba(37, 99, 235, 0.08)'"
          ></app-line-chart>
        </div>

        <!-- Historic Total Parts Produced Chart -->
        <div class="grid-item">
          <app-line-chart
            [data]="state.partsProducedHistory"
            [title]="'Historic Parts Produced (Current Session)'"
            [unit]="'units'"
            [strokeColor]="'#10b981'"
            [fillColor]="'rgba(16, 185, 129, 0.08)'"
          ></app-line-chart>
        </div>
      </div>

      <!-- Order Progress & Production Interrupts -->
      <div class="secondary-grid" *ngIf="state.selectedDeviceId">
        <!-- Order Progress Gauge -->
        <div class="grid-item-order">
          <app-progress-gauge
            [target]="state.orderInfo?.productionTarget || 0"
            [produced]="state.orderInfo?.productionState || 0"
            [orderNumber]="state.currentOrderId || ''"
          ></app-progress-gauge>
        </div>

        <!-- Latest Production Interrupts -->
        <div class="grid-item-interrupts">
          <app-interrupt-log
            [interrupts]="state.interrupts"
          ></app-interrupt-log>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 20px;

      @media (max-width: 900px) {
        grid-template-columns: 1fr;
      }
    }

    .secondary-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;

      @media (max-width: 900px) {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class DashboardComponent implements OnInit, OnDestroy {
  private readonly store = inject(DashboardStore);
  public readonly state$ = this.store.state$;

  ngOnInit(): void {
    this.store.loadDevices();
  }

  ngOnDestroy(): void {
    this.store.destroy();
  }

  public onDeviceSelected(deviceId: string): void {
    this.store.selectDevice(deviceId);
  }
}
