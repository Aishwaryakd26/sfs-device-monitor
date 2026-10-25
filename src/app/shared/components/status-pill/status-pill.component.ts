import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-status-pill',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="status-pill" [ngClass]="statusClass">
      <span class="status-dot"></span>
      <span class="status-label">{{ status | titlecase }}</span>
      <span *ngIf="showHint && status !== 'running'" class="hint-badge">
        {{ status === 'stopped' ? 'Needs Attention' : 'Under Service' }}
      </span>
    </div>
  `,
  styles: [`
    .status-pill {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 12px;
      border-radius: 9999px;
      font-size: 0.85rem;
      font-weight: 600;
      transition: all 0.2s ease;
    }

    .status-dot {
      width: 9px;
      height: 9px;
      border-radius: 50%;
    }

    .status-running {
      background-color: #ecfdf5;
      color: #065f46;
      border: 1px solid #a7f3d0;
      .status-dot { background-color: #10b981; }
    }

    .status-stopped {
      background-color: #fef2f2;
      color: #991b1b;
      border: 1px solid #fecaca;
      .status-dot {
        background-color: #ef4444;
        animation: blink 1s ease infinite alternate;
      }
    }

    .status-maintenance {
      background-color: #fffbeb;
      color: #92400e;
      border: 1px solid #fde68a;
      .status-dot {
        background-color: #f59e0b;
        animation: blink 1.5s ease infinite alternate;
      }
    }

    .hint-badge {
      font-size: 0.72rem;
      background: rgba(0,0,0,0.06);
      padding: 1px 6px;
      border-radius: 4px;
      margin-left: 2px;
    }

    @keyframes blink {
      from { opacity: 1; transform: scale(1); }
      to { opacity: 0.3; transform: scale(0.85); }
    }
  `]
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
