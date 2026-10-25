import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductionInterrupt } from '../../../../core/models/app.models';

@Component({
  selector: 'app-interrupt-log',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="interrupt-card">
      <div class="card-header">
        <h4 class="card-title">Production Interrupts</h4>
        <span class="count-badge" [class.has-interrupts]="interrupts.length > 0">
          {{ interrupts.length }} {{ interrupts.length === 1 ? 'Incident' : 'Incidents' }}
        </span>
      </div>

      <div class="interrupt-list" *ngIf="interrupts.length > 0; else noInterrupts">
        <div 
          *ngFor="let interrupt of interrupts" 
          class="interrupt-item"
          [ngClass]="'item-' + interrupt.status"
        >
          <div class="interrupt-icon">
            {{ interrupt.status === 'stopped' ? '🛑' : '🔧' }}
          </div>
          <div class="interrupt-info">
            <div class="interrupt-title">
              Machine {{ interrupt.status === 'stopped' ? 'Emergency / Stopped State' : 'Maintenance Intervention' }}
            </div>
            <div class="interrupt-meta">
              <span>Device #{{ interrupt.deviceId }}</span>
              <span>•</span>
              <span>{{ interrupt.timestamp | date:'HH:mm:ss' }}</span>
              <span *ngIf="interrupt.durationSeconds">• {{ interrupt.durationSeconds }}s duration</span>
            </div>
          </div>
        </div>
      </div>

      <ng-template #noInterrupts>
        <div class="empty-state">
          <span class="empty-icon">✨</span>
          <p class="empty-text">No interrupts detected for the selected machine session.</p>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .interrupt-card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 16px 20px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.04);
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }

    .card-title {
      font-size: 0.95rem;
      font-weight: 600;
      color: #334155;
      margin: 0;
    }

    .count-badge {
      font-size: 0.75rem;
      padding: 3px 8px;
      border-radius: 9999px;
      background: #f1f5f9;
      color: #64748b;
      font-weight: 600;

      &.has-interrupts {
        background: #fee2e2;
        color: #b91c1c;
      }
    }

    .interrupt-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
      max-height: 240px;
      overflow-y: auto;
    }

    .interrupt-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 12px;
      border-radius: 8px;
      border: 1px solid #f1f5f9;
      transition: background 0.15s ease;

      &.item-stopped {
        background: #fffafa;
        border-color: #fee2e2;
      }

      &.item-maintenance {
        background: #fffdf5;
        border-color: #fef3c7;
      }
    }

    .interrupt-icon {
      font-size: 1.1rem;
    }

    .interrupt-info {
      flex: 1;
    }

    .interrupt-title {
      font-size: 0.85rem;
      font-weight: 600;
      color: #1e293b;
    }

    .interrupt-meta {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 0.75rem;
      color: #64748b;
      margin-top: 2px;
    }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 30px 16px;
      text-align: center;
      color: #94a3b8;
    }

    .empty-icon {
      font-size: 1.5rem;
      margin-bottom: 6px;
    }

    .empty-text {
      margin: 0;
      font-size: 0.82rem;
    }
  `]
})
export class InterruptLogComponent {
  @Input() interrupts: ProductionInterrupt[] = [];
}
