/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */


import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
    name: 'bkHtmlSanitizeBypassPipe'
})
export class HtmlSanitizeBypassPipe implements PipeTransform  {

    constructor(private _sanitizer: DomSanitizer) {
    }

    transform(html: string): SafeHtml {
        return this._sanitizer.bypassSecurityTrustHtml(html);
    }

}
