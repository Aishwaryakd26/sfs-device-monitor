import { Pipe, PipeTransform, inject } from '@angular/core';
import { TranslationService } from '../../core/i18n/translation.service';
import { TranslationDictionary } from '../../core/i18n/translations';

@Pipe({
  name: 'translate',
  standalone: true,
  pure: false
})
export class TranslatePipe implements PipeTransform {
  private readonly translationService = inject(TranslationService);

  transform(key: keyof TranslationDictionary): string {
    return this.translationService.translate(key);
  }
}
