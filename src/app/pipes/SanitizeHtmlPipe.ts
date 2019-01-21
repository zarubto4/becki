import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'stripHtmlPipe'
})

export class StripHtmlPipe implements PipeTransform {
    transform(value: string): any {
        return value.replace(/<.*?>/g, ''); // replace tags
    }
}
