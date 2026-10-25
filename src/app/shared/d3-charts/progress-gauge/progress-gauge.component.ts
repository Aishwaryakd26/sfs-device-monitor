import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
  NgZone,
  inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import * as d3 from 'd3';

@Component({
  selector: 'app-progress-gauge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="gauge-card">
      <div class="gauge-header">
        <h4 class="gauge-title">Order Production Progress</h4>
        <span class="order-badge" *ngIf="orderNumber">Order #{{ orderNumber }}</span>
      </div>

      <div class="gauge-body">
        <div #gaugeContainer class="gauge-svg-container"></div>
        
        <div class="progress-details">
          <div class="detail-row">
            <span class="detail-label">Target Units:</span>
            <span class="detail-value">{{ target | number }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Produced So Far:</span>
            <span class="detail-value highlight">{{ produced | number }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Remaining:</span>
            <span class="detail-value">{{ (target > produced ? target - produced : 0) | number }}</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
    }

    .gauge-card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 16px 20px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.04);
      height: 100%;
    }

    .gauge-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }

    .gauge-title {
      font-size: 0.95rem;
      font-weight: 600;
      color: #334155;
      margin: 0;
    }

    .order-badge {
      background: #f1f5f9;
      color: #475569;
      padding: 3px 8px;
      border-radius: 6px;
      font-size: 0.78rem;
      font-weight: 600;
    }

    .gauge-body {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
    }

    .gauge-svg-container {
      width: 100%;
      height: 180px;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .progress-details {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 6px;
      padding-top: 10px;
      border-top: 1px solid #f1f5f9;
    }

    .detail-row {
      display: flex;
      justify-content: space-between;
      font-size: 0.85rem;

      .detail-label {
        color: #64748b;
      }

      .detail-value {
        font-weight: 600;
        color: #1e293b;

        &.highlight {
          color: #2563eb;
        }
      }
    }
  `]
})
export class ProgressGaugeComponent implements OnInit, OnChanges {
  @ViewChild('gaugeContainer', { static: true }) private gaugeContainer!: ElementRef<HTMLDivElement>;

  @Input() target: number = 0;
  @Input() produced: number = 0;
  @Input() orderNumber: string = '';

  private readonly zone = inject(NgZone);

  ngOnInit(): void {
    this.renderGauge();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.gaugeContainer) {
      this.renderGauge();
    }
  }

  private renderGauge(): void {
    this.zone.runOutsideAngular(() => {
      const container = this.gaugeContainer.nativeElement;
      const width = container.clientWidth || 220;
      const height = container.clientHeight || 180;
      const radius = Math.min(width, height * 1.5) / 2 - 14;

      d3.select(container).selectAll('*').remove();

      const svg = d3.select(container)
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', `translate(${width / 2}, ${height * 0.72})`);

      const percentage = this.target > 0 ? Math.min(100, (this.produced / this.target) * 100) : 0;

      // Half-circle arc
      const startAngle = -Math.PI / 2;
      const totalAngle = Math.PI;
      const endAngle = startAngle + (totalAngle * (percentage / 100));

      const arcBackground = d3.arc()
        .innerRadius(radius - 18)
        .outerRadius(radius)
        .startAngle(startAngle)
        .endAngle(Math.PI / 2)
        .cornerRadius(6);

      const arcForeground = d3.arc()
        .innerRadius(radius - 18)
        .outerRadius(radius)
        .startAngle(startAngle)
        .endAngle(endAngle)
        .cornerRadius(6);

      // Background track
      svg.append('path')
        .attr('d', arcBackground as any)
        .attr('fill', '#e2e8f0');

      // Foreground arc
      const progressColor = percentage >= 100 ? '#10b981' : percentage > 75 ? '#3b82f6' : '#6366f1';
      svg.append('path')
        .attr('d', arcForeground as any)
        .attr('fill', progressColor);

      // Percentage Text
      svg.append('text')
        .attr('text-anchor', 'middle')
        .attr('y', -10)
        .attr('font-size', '26px')
        .attr('font-weight', '700')
        .attr('fill', '#0f172a')
        .text(`${percentage.toFixed(1)}%`);

      // Label
      svg.append('text')
        .attr('text-anchor', 'middle')
        .attr('y', 14)
        .attr('font-size', '11px')
        .attr('font-weight', '500')
        .attr('fill', '#64748b')
        .text('COMPLETED');
    });
  }
}
