import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { RuntimeConfigService } from './core/config/runtime-config.service';
import { EnvBadgeComponent } from './shared/components/env-badge/env-badge.component';
import { ToastContainerComponent } from './shared/components/toast-container/toast-container.component';
import { LangSwitcherComponent } from './shared/components/lang-switcher/lang-switcher.component';
import { TranslatePipe } from './shared/pipes/translate.pipe';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    EnvBadgeComponent,
    ToastContainerComponent,
    LangSwitcherComponent,
    TranslatePipe
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  private readonly configService = inject(RuntimeConfigService);
  public readonly config$ = this.configService.config$;
}
