/**
 * Created by dominik.krisztof on 01.12.16.
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
