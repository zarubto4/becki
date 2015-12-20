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

import * as fields from "./fields";

@ng.Component({
  selector: "[form]",
  templateUrl: "app/lib-adminlte/form.html",
  directives: [fields.Component, ng.FORM_DIRECTIVES],
  inputs: ["title: formTitle", "fields: form"]
})
export class Component {
  @ng.Output()
  cancel = new ng.EventEmitter();

  onSubmit():void {
    "use strict";
  }

  onCancelClick(event:Event):void {
    "use strict";

    this.cancel.next(event);
  }
}
