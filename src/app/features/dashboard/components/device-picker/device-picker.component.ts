import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '../../../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-device-picker',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslatePipe],
  templateUrl: './device-picker.component.html',
  styleUrls: ['./device-picker.component.scss']
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
