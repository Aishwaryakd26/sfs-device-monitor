import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationService } from '../../../core/i18n/translation.service';
import { SupportedLanguage } from '../../../core/i18n/translations';

@Component({
  selector: 'app-lang-switcher',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lang-switcher.component.html',
  styleUrls: ['./lang-switcher.component.scss']
})
export class LangSwitcherComponent {
  private readonly translationService = inject(TranslationService);
  public readonly currentLang$ = this.translationService.currentLang$;

  @Input() availableLanguages: string[] = ['en', 'de'];

  public switchLanguage(lang: string): void {
    this.translationService.setLanguage(lang as SupportedLanguage);
  }
}
