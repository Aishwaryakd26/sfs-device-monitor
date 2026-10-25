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
  templateUrl: './progress-gauge.component.html',
  styleUrls: ['./progress-gauge.component.scss']
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

      svg.append('path')
        .attr('d', arcBackground as any)
        .attr('fill', '#e2e8f0');

      const progressColor = percentage >= 100 ? '#10b981' : percentage > 75 ? '#3b82f6' : '#6366f1';
      svg.append('path')
        .attr('d', arcForeground as any)
        .attr('fill', progressColor);

      svg.append('text')
        .attr('text-anchor', 'middle')
        .attr('y', -10)
        .attr('font-size', '26px')
        .attr('font-weight', '700')
        .attr('fill', '#0f172a')
        .text(`${percentage.toFixed(1)}%`);

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
