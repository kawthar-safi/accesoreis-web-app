import { inject, Pipe, PipeTransform } from '@angular/core';
import { I18nService } from '../../service/i18n/i18n.service';

@Pipe({
  name: 'translate',
  pure: false,
})
export class TranslatePipe implements PipeTransform {
  i18nService = inject(I18nService);

  transform(key: string): string {
    return this.i18nService.t(key);
  }
}
