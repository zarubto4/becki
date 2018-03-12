/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'bkStringReplacer'
})
export class StringReplacerPipe implements PipeTransform {
    transform(input: string, replace: string = '_', replaceWith: string = ' '): string {
        // lze použít i regulární výraz
        // how to call multiple arguments: {{ myData | bkStringReplacer: arg1:arg2 }}
        return input.replace(replace, replaceWith);
    }
}
