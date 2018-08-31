/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */

import { Pipe, PipeTransform } from '@angular/core';
import { TranslationService } from '../services/TranslationService';

@Pipe({
    name: 'bkPrice'
})
export class PricePipe implements PipeTransform {
    constructor(public translationService: TranslationService) {}

    transform(price: number, freeLabel = false, ...args: string[]) {
        if (freeLabel && price === 0) {
            return this.translationService.translate('label_free', this);
        }

        if (price) {
            return price.toFixed(2)  + '$';
        }

        return '---';
    }
}
