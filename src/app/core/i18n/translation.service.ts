import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SupportedLanguage, TranslationDictionary, TRANSLATIONS } from './translations';
import { RuntimeConfigService } from '../config/runtime-config.service';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private readonly configService = inject(RuntimeConfigService);

  private readonly currentLangSubject = new BehaviorSubject<SupportedLanguage>('en');
  public readonly currentLang$: Observable<SupportedLanguage> = this.currentLangSubject.asObservable();

  private readonly translationsSubject = new BehaviorSubject<TranslationDictionary>(TRANSLATIONS.en);
  public readonly translations$: Observable<TranslationDictionary> = this.translationsSubject.asObservable();

  constructor() {
    // Sync available languages from config if available
    this.configService.config$.subscribe(config => {
      if (config?.availableLanguages && !config.availableLanguages.includes(this.currentLangSubject.value)) {
        const fallback = (config.availableLanguages[0] as SupportedLanguage) || 'en';
        this.setLanguage(fallback);
      }
    });
  }

  public get currentLanguage(): SupportedLanguage {
    return this.currentLangSubject.value;
  }

  public get t(): TranslationDictionary {
    return this.translationsSubject.value;
  }

  public setLanguage(lang: SupportedLanguage): void {
    if (TRANSLATIONS[lang]) {
      this.currentLangSubject.next(lang);
      this.translationsSubject.next(TRANSLATIONS[lang]);
    }
  }

  public translate(key: keyof TranslationDictionary): string {
    return this.translationsSubject.value[key] || (key as string);
  }
}
