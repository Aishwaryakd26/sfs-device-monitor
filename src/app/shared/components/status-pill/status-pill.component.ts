import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-status-pill',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './status-pill.component.html',
  styleUrls: ['./status-pill.component.scss']
})
export class StatusPillComponent {
  @Input() status: 'running' | 'stopped' | 'maintenance' | string = 'running';
  @Input() showHint: boolean = true;

  get statusClass(): string {
    switch (this.status?.toLowerCase()) {
      case 'stopped':
        return 'status-stopped';
      case 'maintenance':
        return 'status-maintenance';
      case 'running':
      default:
        return 'status-running';
    }
  }
}
