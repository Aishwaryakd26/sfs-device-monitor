import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { TranslationDictionary } from '../../../core/i18n/translations';

@Component({
  selector: 'app-status-pill',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './status-pill.component.html',
  styleUrls: ['./status-pill.component.scss']
})
export class StatusPillComponent {
  @Input() status: 'running' | 'stopped' | 'maintenance' | string = 'running';
  @Input() showHint: boolean = true;

  get statusLabelKey(): keyof TranslationDictionary {
    switch (this.status?.toLowerCase()) {
      case 'stopped':
        return 'statusStopped';
      case 'maintenance':
        return 'statusMaintenance';
      case 'running':
      default:
        return 'statusRunning';
    }
  }

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
