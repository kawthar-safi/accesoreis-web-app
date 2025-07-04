import { Component, inject } from '@angular/core';
import { I18nService } from '../../../service/i18n/i18n.service';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'app-header',
  imports: [TranslatePipe],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  i18nService = inject(I18nService);
  language: 'en' | 'ar' = 'en';
  switchToArabic() {
    this.language = 'ar';
    this.i18nService.loadTranslations(this.language);
  }

  switchToEnglish() {
    this.language = 'en';
    this.i18nService.loadTranslations(this.language);
  }
}
