/*
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */

import * as blocko from "blocko";
import * as theGrid from "the-grid";

import * as libBootstrapModal from "../modals/modal";

export class WidgetModel implements libBootstrapModal.Model {

  widget:theGrid.Core.Widget;

  readonly:boolean;

  constructor(widget:theGrid.Core.Widget, readonly = false) {
    "use strict";

    this.widget = widget;
    this.readonly = readonly;
  }
}

export class BlockModel implements libBootstrapModal.Model {

  block:blocko.BlockoCore.Block;

  readonly:boolean;

  constructor(widget:blocko.BlockoCore.Block, readonly = false) {
    "use strict";

    this.block = widget;
    this.readonly = readonly;
  }
}
