/**
 * Created by davidhradek on 18.04.17.
 */

import { Pipe, PipeTransform } from '@angular/core';

var markdown = require( "markdown" ).markdown;

@Pipe({
    name: 'bkMd2Html'
})
export class Md2HtmlPipe implements PipeTransform {
    transform(input: string) {
        return markdown.toHTML(input);
    }
}
