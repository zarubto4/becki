/**
 * Created by dominikkrisztof on 13.03.17.
 */

import { Pipe, PipeTransform } from '@angular/core';
import { TranslationService } from './../services/TranslationService';

@Pipe({
    name: 'bkTanslateTable'
})
export class TranslateTablePipe implements PipeTransform {
    constructor(public translationService: TranslationService) { }

    transform(input: string, key: string, table: string, lang: string = 'en'): string {
        // input = key

        let translated = this.translationService.translateTable(input, table, lang);
        if (!translated) {
            return '!!!' + input;
        }
        return translated;
    }
    // how to call multiple arguments: {{ myData | TranslatePipe:table:lang }}
}
