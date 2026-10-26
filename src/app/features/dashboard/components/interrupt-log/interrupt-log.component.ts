import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductionInterrupt } from '../../../../core/models/app.models';
import { TranslatePipe } from '../../../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-interrupt-log',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './interrupt-log.component.html',
  styleUrls: ['./interrupt-log.component.scss']
})
export class InterruptLogComponent {
  @Input() interrupts: ProductionInterrupt[] = [];
}
