/*
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */
"use strict";
var WidgetModel = (function () {
    function WidgetModel(widget, readonly) {
        "use strict";
        if (readonly === void 0) { readonly = false; }
        this.widget = widget;
        this.readonly = readonly;
    }
    return WidgetModel;
}());
exports.WidgetModel = WidgetModel;
var BlockModel = (function () {
    function BlockModel(widget, readonly) {
        "use strict";
        if (readonly === void 0) { readonly = false; }
        this.block = widget;
        this.readonly = readonly;
    }
    return BlockModel;
}());
exports.BlockModel = BlockModel;
//# sourceMappingURL=modal.js.map