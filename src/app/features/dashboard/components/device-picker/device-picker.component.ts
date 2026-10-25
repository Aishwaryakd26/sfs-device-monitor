import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-device-picker',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="picker-container">
      <label for="deviceSelect" class="picker-label">
        <span class="label-icon">⚙️</span>
        <span>Select Production Machine:</span>
      </label>
      
      <div class="select-wrapper">
        <select 
          id="deviceSelect" 
          [ngModel]="selectedDeviceId" 
          (ngModelChange)="onDeviceChange($event)"
          class="device-select"
        >
          <option value="" disabled>-- Choose a Device --</option>
          <option *ngFor="let device of devices" [value]="device">
            Machine #{{ device }}
          </option>
        </select>
        <span class="select-arrow">▾</span>
      </div>

      <div class="device-pill-list" *ngIf="devices && devices.length > 0">
        <button
          *ngFor="let device of devices.slice(0, 6)"
          type="button"
          class="quick-pill"
          [class.active]="device === selectedDeviceId"
          (click)="onDeviceChange(device)"
        >
          #{{ device }}
        </button>
      </div>
    </div>
  `,
  styles: [`
    .picker-container {
      display: flex;
      align-items: center;
      gap: 16px;
      flex-wrap: wrap;
      background: #ffffff;
      padding: 14px 20px;
      border-radius: 12px;
      border: 1px solid #e2e8f0;
      box-shadow: 0 1px 3px rgba(0,0,0,0.04);
    }

    .picker-label {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 600;
      color: #334155;
      font-size: 0.92rem;
    }

    .select-wrapper {
      position: relative;
      display: inline-block;
      min-width: 200px;
    }

    .device-select {
      width: 100%;
      appearance: none;
      background: #f8fafc;
      border: 1.5px solid #cbd5e1;
      padding: 8px 36px 8px 14px;
      border-radius: 8px;
      font-size: 0.9rem;
      font-weight: 600;
      color: #1e293b;
      cursor: pointer;
      outline: none;
      transition: all 0.2s ease;

      &:focus {
        border-color: #3b82f6;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
        background: #ffffff;
      }
    }

    .select-arrow {
      position: absolute;
      right: 14px;
      top: 50%;
      transform: translateY(-50%);
      pointer-events: none;
      color: #64748b;
      font-size: 0.8rem;
    }

    .device-pill-list {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-left: auto;
    }

    .quick-pill {
      background: #f1f5f9;
      border: 1px solid #e2e8f0;
      padding: 5px 10px;
      border-radius: 6px;
      font-size: 0.78rem;
      font-weight: 600;
      color: #475569;
      cursor: pointer;
      transition: all 0.15s ease;

      &:hover {
        background: #e2e8f0;
        color: #1e293b;
      }

      &.active {
        background: #2563eb;
        color: #ffffff;
        border-color: #2563eb;
      }
    }
  `]
})
export class DevicePickerComponent {
  @Input() devices: string[] = [];
  @Input() selectedDeviceId: string | null = null;
  @Output() deviceSelected = new EventEmitter<string>();

  public onDeviceChange(id: string): void {
    if (id && id !== this.selectedDeviceId) {
      this.deviceSelected.emit(id);
    }
  }
}
