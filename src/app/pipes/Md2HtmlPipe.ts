/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */


import { Pipe, PipeTransform } from '@angular/core';

const markdown = require( 'markdown' ).markdown;

@Pipe({
    name: 'bkMd2Html'
})
export class Md2HtmlPipe implements PipeTransform {
    transform(input: string) {
        return markdown.toHTML(input);
    }
}
