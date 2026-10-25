import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatusPillComponent } from '../../../../shared/components/status-pill/status-pill.component';

@Component({
  selector: 'app-device-overview',
  standalone: true,
  imports: [CommonModule, StatusPillComponent],
  template: `
    <div class="overview-banner" [ngClass]="'banner-' + (status || 'running')">
      <div class="banner-main">
        <div class="device-meta">
          <span class="device-tag">Active Machine</span>
          <h2 class="device-id">Machine #{{ deviceId }}</h2>
        </div>
        
        <div class="status-box">
          <app-status-pill [status]="status" [showHint]="true"></app-status-pill>
        </div>
      </div>

      <!-- Visual Hints for Problems -->
      <div *ngIf="status === 'stopped'" class="problem-hint stopped-hint">
        <span class="hint-icon">🛑</span>
        <div class="hint-content">
          <strong>Machine Halted:</strong> Production stopped abruptly. Inspect machine sensor inputs and resolve interrupt log.
        </div>
      </div>

      <div *ngIf="status === 'maintenance'" class="problem-hint maintenance-hint">
        <span class="hint-icon">🔧</span>
        <div class="hint-content">
          <strong>Scheduled Maintenance in Progress:</strong> Machine undergoing calibration or servicing. Metric collection is suspended.
        </div>
      </div>
    </div>
  `,
  styles: [`
    .overview-banner {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 18px 24px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.04);
      display: flex;
      flex-direction: column;
      gap: 12px;
      transition: border-color 0.2s ease;

      &.banner-stopped {
        border-color: #fca5a5;
        background: #fffafa;
      }

      &.banner-maintenance {
        border-color: #fde68a;
        background: #fffdf5;
      }
    }

    .banner-main {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .device-tag {
      font-size: 0.75rem;
      text-transform: uppercase;
      font-weight: 700;
      letter-spacing: 0.05em;
      color: #64748b;
    }

    .device-id {
      margin: 2px 0 0 0;
      font-size: 1.5rem;
      font-weight: 700;
      color: #0f172a;
    }

    .problem-hint {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 14px;
      border-radius: 8px;
      font-size: 0.85rem;
    }

    .stopped-hint {
      background: #fee2e2;
      color: #991b1b;
      border: 1px solid #fecaca;
    }

    .maintenance-hint {
      background: #fef3c7;
      color: #92400e;
      border: 1px solid #fde68a;
    }

    .hint-icon {
      font-size: 1.2rem;
    }
  `]
})
export class DeviceOverviewComponent {
  @Input() deviceId: string = '';
  @Input() status: 'running' | 'stopped' | 'maintenance' = 'running';
}
