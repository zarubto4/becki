/**
 * Created by dominikkrisztof on 13.03.17.
 */

import { Pipe, PipeTransform } from '@angular/core';
import { TranslationService } from './../services/TranslationService';

@Pipe({
    name: 'bkTranslate'
})
export class TranslatePipe implements PipeTransform {
    constructor(public translationService: TranslationService) {}

    transform(input: string, environment: any, ...args: string[]) {
        // input = key

        let translated = this.translationService.translate(input, environment, null, args);
        if (!translated) {
            return '!!!' + input;
        }
        return translated;
    }
    // how to call multiple arguments: {{ myData | bkTranslate:this:"arg1":"arg2" }}

}
