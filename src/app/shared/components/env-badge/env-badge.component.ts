import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-env-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="env-badge" [ngClass]="badgeClass">
      <span class="indicator-dot"></span>
      <span class="env-text">{{ environmentName }}</span>
    </div>
  `,
  styles: [`
    .env-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 10px;
      border-radius: 9999px;
      font-weight: 700;
      font-size: 0.8rem;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      box-shadow: 0 1px 2px rgba(0,0,0,0.06);
    }

    .indicator-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: currentColor;
      animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }

    /* Test (Blue [TEST]) */
    .env-test {
      background-color: #ebf5ff;
      color: #1e40af;
      border: 1px solid #bfdbfe;
    }

    /* Quality (Orange [QUAL]) */
    .env-qual {
      background-color: #fff7ed;
      color: #c2410c;
      border: 1px solid #fed7aa;
    }

    /* Production (Red [PROD]) */
    .env-prod {
      background-color: #fef2f2;
      color: #b91c1c;
      border: 1px solid #fecaca;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.4; }
    }
  `]
})
export class EnvBadgeComponent {
  @Input() environmentName: string = '[TEST]';
  @Input() environmentColour: string = 'blue';

  get badgeClass(): string {
    const col = (this.environmentColour || '').toLowerCase();
    const name = (this.environmentName || '').toLowerCase();

    if (col === 'orange' || name.includes('qual')) {
      return 'env-qual';
    }
    if (col === 'red' || name.includes('prod')) {
      return 'env-prod';
    }
    return 'env-test';
  }
}
