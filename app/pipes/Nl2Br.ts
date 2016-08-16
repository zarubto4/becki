/**
 * Created by davidhradek on 04.08.16.
 */

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'nl2br'
})
export class Nl2Br implements PipeTransform {
    transform(input:string) {
        return input.replace("\n", "<br \>");
    }
}