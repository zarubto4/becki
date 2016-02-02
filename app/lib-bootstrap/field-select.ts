/*
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
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

export class Option {

  label:string;

  value:string;

  selected:boolean;

  constructor(label:string, value:string, selected = false) {
    "use strict";

    this.label = label;
    this.value = value;
    this.selected = selected;
  }
}

@ng.Component({
  selector: "[field-select]",
  templateUrl: "app/lib-bootstrap/field-select.html",
  directives: [ng.CORE_DIRECTIVES, ng.FORM_DIRECTIVES]
})
export class Component {

  @ng.Input("fieldSelect")
  model:string;

  @ng.Input()
  options:Option[];

  @ng.Input()
  multiple:boolean;

  @ng.Output("fieldSelectChange")
  modelChange = new ng.EventEmitter();

  onChange(value:string):void {
    "use strict";

    this.modelChange.next(value);
  }

  onInput(event:Event):void {
    "use strict";

    let offset = this.multiple ? 0 : +1;
    for (let index = 0; index < this.options.length; index++) {
      this.options[index].selected = (<HTMLSelectElement>event.target).options[index + offset].selected;
    }
  }
}
