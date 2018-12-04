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



    transform(unixtime: number, format: string = 'LLLL'): string {

        // Tim in second
        if (unixtime < 9999999999) {
            unixtime = unixtime * 1000;
        }

        return moment(unixtime * 1000).format(format);
    }
}
