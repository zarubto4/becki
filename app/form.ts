/*
 * © 2015-2016 Becki Authors. See the AUTHORS file found in the top-level
 * directory of this distribution.
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

import * as fieldCustom from "./field-custom";
import * as libBootstrapFields from "./lib-bootstrap/fields";

@ng.Component({
  selector: "[fields]",
  templateUrl: "app/lib-bootstrap/fields.html",
  directives: [fieldCustom.Component, ng.CORE_DIRECTIVES, ng.FORM_DIRECTIVES],
  inputs: ["fields"],
  outputs: ["fieldChange"]
})
class Fields extends libBootstrapFields.Component {
}

@ng.Component({
  selector: "[form]",
  templateUrl: "app/form.html",
  directives: [Fields, ng.CORE_DIRECTIVES, ng.FORM_DIRECTIVES],
  inputs: ["fields: form", "cancellable"]
})
export class Component {

  @ng.Output()
  fieldChange = new ng.EventEmitter();

  @ng.Output()
  cancel = new ng.EventEmitter();

  onFieldChange(field:libBootstrapFields.Field):void {
    "use strict";

    this.fieldChange.next(field);
  }

  onSubmit():void {
    "use strict";
  }

  onCancelClick(event:Event):void {
    "use strict";

    this.cancel.next(event);
  }
}
