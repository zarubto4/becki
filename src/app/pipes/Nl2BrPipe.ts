

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'bkNl2Br'
})
export class Nl2BrPipe implements PipeTransform {
    transform(input: string) {
        return input.replace(/\n/g, '<br \>');
    }
}
