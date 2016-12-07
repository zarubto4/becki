/**
 * Created by dominik.krisztof on 02.12.16.
 */


import { Pipe, PipeTransform } from '@angular/core';


@Pipe({
    name: 'StringReplacer'
})
export class StringReplacer implements PipeTransform {
    transform(input: string, replace:string ="_", replaceWith:string = " "):string{
    //lze použít i regulární výraz
    //how to call multiple arguments: {{ myData | StringReplacer: arg1:arg2 }}
        return input.replace(replace,replaceWith);
    }
}
