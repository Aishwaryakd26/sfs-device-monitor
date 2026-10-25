import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild,
  NgZone,
  inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import * as d3 from 'd3';
import { TelemetryPoint } from '../../../core/models/app.models';

@Component({
  selector: 'app-line-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="chart-wrapper">
      <div class="chart-header">
        <h4 class="chart-title">{{ title }}</h4>
        <div class="chart-current-value" *ngIf="data && data.length > 0">
          <span class="curr-val">{{ data[data.length - 1].value | number:'1.1-2' }}</span>
          <span class="curr-unit">{{ unit }}</span>
        </div>
      </div>
      <div #chartContainer class="chart-container"></div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
    }

    .chart-wrapper {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 16px 20px 12px 20px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.04);
      display: flex;
      flex-direction: column;
      height: 100%;
      min-height: 280px;
    }

    .chart-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }

    .chart-title {
      font-size: 0.95rem;
      font-weight: 600;
      color: #334155;
      margin: 0;
    }

    .chart-current-value {
      display: flex;
      align-items: baseline;
      gap: 4px;

      .curr-val {
        font-size: 1.35rem;
        font-weight: 700;
        color: #0f172a;
      }

      .curr-unit {
        font-size: 0.8rem;
        color: #64748b;
        font-weight: 500;
      }
    }

    .chart-container {
      width: 100%;
      height: 220px;
      position: relative;
    }
  `]
})
export class LineChartComponent implements OnInit, OnChanges, OnDestroy {
  @ViewChild('chartContainer', { static: true }) private chartContainer!: ElementRef<HTMLDivElement>;

  @Input() data: TelemetryPoint[] = [];
  @Input() title: string = 'Metric Over Time';
  @Input() unit: string = '';
  @Input() strokeColor: string = '#2563eb';
  @Input() fillColor: string = 'rgba(37, 99, 235, 0.08)';

  private readonly zone = inject(NgZone);
  private resizeObserver?: ResizeObserver;
  private svg?: d3.Selection<SVGSVGElement, unknown, null, undefined>;

  ngOnInit(): void {
    // Senior Pattern: observe container resize and re-render D3 chart outside Angular zone
    this.setupResizeObserver();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && this.chartContainer) {
      this.renderChart();
    }
  }

  ngOnDestroy(): void {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }

  private setupResizeObserver(): void {
    this.resizeObserver = new ResizeObserver(() => {
      this.renderChart();
    });
    this.resizeObserver.observe(this.chartContainer.nativeElement);
  }

  private renderChart(): void {
    // Run outside Angular change detection zone for 60fps chart rendering
    this.zone.runOutsideAngular(() => {
      const container = this.chartContainer.nativeElement;
      const width = container.clientWidth || 400;
      const height = container.clientHeight || 220;

      // Clear previous SVG
      d3.select(container).selectAll('*').remove();

      if (!this.data || this.data.length === 0) {
        const emptySvg = d3.select(container)
          .append('svg')
          .attr('width', width)
          .attr('height', height);

        emptySvg.append('text')
          .attr('x', width / 2)
          .attr('y', height / 2)
          .attr('text-anchor', 'middle')
          .attr('fill', '#94a3b8')
          .attr('font-size', '13px')
          .text('Awaiting device telemetry stream...');
        return;
      }

      const margin = { top: 10, right: 20, bottom: 25, left: 45 };
      const innerWidth = width - margin.left - margin.right;
      const innerHeight = height - margin.top - margin.bottom;

      this.svg = d3.select(container)
        .append('svg')
        .attr('width', width)
        .attr('height', height);

      const g = this.svg.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

      // X Scale (Time)
      const xExtent = d3.extent(this.data, d => d.timestamp) as [Date, Date];
      const xScale = d3.scaleTime()
        .domain(xExtent[0] && xExtent[1] ? xExtent : [new Date(), new Date()])
        .range([0, innerWidth]);

      // Y Scale (Values)
      const yMax = d3.max(this.data, d => d.value) || 10;
      const yMin = d3.min(this.data, d => d.value) || 0;
      const yScale = d3.scaleLinear()
        .domain([Math.max(0, yMin * 0.9), yMax * 1.08])
        .nice()
        .range([innerHeight, 0]);

      // Gridlines
      const yGrid = d3.axisLeft(yScale)
        .ticks(5)
        .tickSize(-innerWidth)
        .tickFormat(() => '');

      g.append('g')
        .attr('class', 'grid')
        .call(yGrid)
        .selectAll('line')
        .attr('stroke', '#f1f5f9');

      // X Axis
      const xAxis = d3.axisBottom(xScale)
        .ticks(Math.max(3, Math.floor(innerWidth / 90)))
        .tickFormat(d => d3.timeFormat('%H:%M:%S')(d as Date));

      g.append('g')
        .attr('transform', `translate(0,${innerHeight})`)
        .call(xAxis)
        .call(axis => axis.select('.domain').attr('stroke', '#cbd5e1'))
        .call(axis => axis.selectAll('.tick line').attr('stroke', '#cbd5e1'))
        .call(axis => axis.selectAll('text').attr('fill', '#64748b').attr('font-size', '11px'));

      // Y Axis
      const yAxis = d3.axisLeft(yScale)
        .ticks(5)
        .tickFormat(d => `${d}`);

      g.append('g')
        .call(yAxis)
        .call(axis => axis.select('.domain').attr('stroke', '#cbd5e1'))
        .call(axis => axis.selectAll('.tick line').attr('stroke', '#cbd5e1'))
        .call(axis => axis.selectAll('text').attr('fill', '#64748b').attr('font-size', '11px'));

      // Area fill
      const area = d3.area<TelemetryPoint>()
        .x(d => xScale(d.timestamp))
        .y0(innerHeight)
        .y1(d => yScale(d.value))
        .curve(d3.curveMonotoneX);

      g.append('path')
        .datum(this.data)
        .attr('fill', this.fillColor)
        .attr('d', area);

      // Line
      const line = d3.line<TelemetryPoint>()
        .x(d => xScale(d.timestamp))
        .y(d => yScale(d.value))
        .curve(d3.curveMonotoneX);

      g.append('path')
        .datum(this.data)
        .attr('fill', 'none')
        .attr('stroke', this.strokeColor)
        .attr('stroke-width', 2.5)
        .attr('d', line);

      // Plot point circles
      g.selectAll('.data-dot')
        .data(this.data)
        .enter()
        .append('circle')
        .attr('class', 'data-dot')
        .attr('cx', d => xScale(d.timestamp))
        .attr('cy', d => yScale(d.value))
        .attr('r', 3)
        .attr('fill', '#ffffff')
        .attr('stroke', this.strokeColor)
        .attr('stroke-width', 2);
    });
  }
}
