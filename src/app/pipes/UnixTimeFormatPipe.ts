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
        // 15 44 97 46 41
        if (unixtime < 9999999999) {
            unixtime = unixtime * 1000;
        }

        console.log('UnixTimeFormatPipe:: ', unixtime);
        console.log('UnixTimeFormatPipe:: ', moment(unixtime).format(format));
        console.log('UnixTimeFormatPipe:: ', moment(unixtime).format('LLLL'));
        console.log('UnixTimeFormatPipe:: ', moment(unixtime).format('L'));
        console.log('UnixTimeFormatPipe:: ', moment(unixtime).format('L'));

        return moment(unixtime).format('LLLL');
    }
}
