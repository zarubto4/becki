/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */

import { Pipe, PipeTransform } from '@angular/core';
import moment = require('moment/moment');

@Pipe({
    name: 'bkUnixTimeToDate'
})
export class UnixTimeFormatPipe implements PipeTransform {
    transform(unixtime: number, format: string = 'lll'): string {
        return moment(unixtime).format(format);
    }
}
