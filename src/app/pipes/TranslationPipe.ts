/**
 * Created by dominikkrisztof on 13.03.17.
 */

import { Pipe, PipeTransform } from '@angular/core';
import { TranslationService } from './../services/TranslationService';

@Pipe({
    name: 'bkTanslate'
})
export class TranslatePipe implements PipeTransform {
    constructor(public translationService: TranslationService) {}

    transform(input: string, lang: string = 'en'): string {
        // input = key

        let translated = this.translationService.translate(input, lang);
        if (!translated) {
            return '!!!' + input;
        }
        return translated;
    }
    // how to call multiple arguments: {{ myData | TranslatePipe:lang }}

}
