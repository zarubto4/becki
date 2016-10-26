/*
 * © 2015-2016 Becki Authors. See the AUTHORS file found in the top-level
 * directory of this distribution.
 */

export function timestampToString(timestamp:number):string {
  "use strict";

  return new Date(timestamp * 1000).toLocaleString();
}

export function getAdvancedField(field:string, options:string[]):string {
  "use strict";

  if (field) {
    return field;
  } else if (options.length == 1) {
    return options[0];
  } else {
    return null;
  }
}
