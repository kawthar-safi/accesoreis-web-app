import { Component, inject } from '@angular/core';
import { I18nService } from '../../../service/i18n/i18n.service';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-header',
  imports: [TranslatePipe, RouterModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  i18nService = inject(I18nService);
  language: 'en' | 'ar' = 'en';
  isArabic = false;
  switchToArabic() {
    this.language = 'ar';
    this.isArabic = true;
    this.i18nService.loadTranslations(this.language);
  }

  switchToEnglish() {
    this.language = 'en';
    this.isArabic = false;
    this.i18nService.loadTranslations(this.language);
  }
  //ممكن احتاجها لما اعدل موضوع انه اللغة تضلها محفوظة حتى لو سكلات الويب سايت
  // ngOnInit() {
  //   this.language = (localStorage.getItem('language') as 'en' | 'ar') || 'en';
  //   this.isArabic = this.language === 'ar';
  // }
}
