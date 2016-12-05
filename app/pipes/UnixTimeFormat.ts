/**
 * Created by dominik.krisztof on 01.12.16.
 */

import { Pipe, PipeTransform } from '@angular/core';
import moment = require("moment/moment");


@Pipe({
    name: 'unixTimeFormat'
})
export class UnixTimeFormat implements PipeTransform {
    transform(unixtime: number, format:string = "lll"):string{
        return moment(unixtime).format(format);
    }
}
