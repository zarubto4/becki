/*
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */

import * as blocko from "blocko";
import * as ng from "angular2/angular2";
import * as theGrid from "the-grid";

export interface Event {

  readonly:boolean;
}

export class WidgetEvent implements Event {

  widget:theGrid.Core.Widget;

  readonly:boolean;

  constructor(widget:theGrid.Core.Widget, readonly = false) {
    "use strict";

    this.widget = widget;
    this.readonly = readonly;
  }
}

export class BlockEvent implements Event {

  block:blocko.BlockoCore.Block;

  readonly:boolean;

  constructor(widget:blocko.BlockoCore.Block, readonly = false) {
    "use strict";

    this.block = widget;
    this.readonly = readonly;
  }
}

@ng.Injectable()
export class Service {

  modalChange = new ng.EventEmitter();
}
