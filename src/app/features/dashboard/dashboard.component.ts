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
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
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
