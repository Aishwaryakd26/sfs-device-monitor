import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-env-badge',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './env-badge.component.html',
  styleUrls: ['./env-badge.component.scss']
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
