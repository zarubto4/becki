/*
 * © 2015 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */
/**
 * !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
 * !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
 *
 * Documentation in this file might be outdated and the code might be dirty and
 * flawed since management prefers speed over quality.
 *
 * !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
 * !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
 */

import * as ng from "angular2/angular2";

import * as form from "./form";
import * as table from "./table";

@ng.Component({
  selector: "[table-with-actions]",
  templateUrl: "app/lib-adminlte/table-with-actions.html",
  directives: [form.Component, table.Component],
  inputs: [
    "tableTitle",
    "objectProperties",
    "tableObjects: tableWithActions",
    "getObjectLink",
    "actionTitle",
    "actionFields"
  ]
})
export class Component {
  @ng.Output()
  cancel = new ng.EventEmitter();

  onSubmit():void {
    "use strict";
  }

  onCancel(event:Event):void {
    "use strict";

    this.cancel.next(event);
  }
}
