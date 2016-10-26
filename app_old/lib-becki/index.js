/*
 * © 2015-2016 Becki Authors. See the AUTHORS file found in the top-level
 * directory of this distribution.
 */
"use strict";
function timestampToString(timestamp) {
    "use strict";
    return new Date(timestamp * 1000).toLocaleString();
}
exports.timestampToString = timestampToString;
function getAdvancedField(field, options) {
    "use strict";
    if (field) {
        return field;
    }
    else if (options.length == 1) {
        return options[0];
    }
    else {
        return null;
    }
}
exports.getAdvancedField = getAdvancedField;
//# sourceMappingURL=index.js.map