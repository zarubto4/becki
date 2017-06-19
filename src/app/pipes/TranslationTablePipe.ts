/**
 * Created by dominikkrisztof on 13.03.17.
 */

import { Pipe, PipeTransform } from '@angular/core';
import { TranslationService } from './../services/TranslationService';

@Pipe({
    name: 'bkTranslateTable'
})
export class TranslateTablePipe implements PipeTransform {
    constructor(public translationService: TranslationService) { }

    transform(input: string, environment: any, table: string, ...args: string[]): string {
        let translated = this.translationService.translateTable(input, environment, table, null, args);
        if (!translated) {
            return '!!!' + input;
        }
        return translated;
    }
    // how to call multiple arguments: {{ myData | bkTranslateTable:table:lang }}
}
