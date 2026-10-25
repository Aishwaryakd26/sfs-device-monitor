import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatusPillComponent } from '../../../../shared/components/status-pill/status-pill.component';

@Component({
  selector: 'app-device-overview',
  standalone: true,
  imports: [CommonModule, StatusPillComponent],
  templateUrl: './device-overview.component.html',
  styleUrls: ['./device-overview.component.scss']
})
export class DeviceOverviewComponent {
  @Input() deviceId: string = '';
  @Input() status: 'running' | 'stopped' | 'maintenance' = 'running';
}
