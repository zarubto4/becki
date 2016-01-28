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

import * as fieldDefault from "./field-default";

export class Option {

  label:string;

  value:string;

  constructor(label:string, value:string) {
    "use strict";

    this.label = label;
    this.value = value;
  }
}

export class Field {

  label:string;

  model:string;

  type:string;

  icon:string;

  options:Option[];

  visible:boolean;

  constructor(label:string, model:string, type = "text", icon = "glyphicon-pencil", options:Option[] = [], visible = true) {
    "use strict";

    this.label = label;
    this.model = model;
    this.type = type;
    this.icon = icon;
    this.options = options;
    this.visible = visible;
  }

  static fromDate(label:string, date:Date, type = "text", icon = "glyphicon-pencil", options:Option[] = [], visible = true) {
    "use strict";

    let year = date.getFullYear();
    let month = ("0" + (date.getMonth() + 1).toString()).slice(-2);
    let day = ("0" + date.getDate().toString()).slice(-2);
    let hour = ("0" + date.getHours().toString()).slice(-2);
    let minute = ("0" + date.getMinutes().toString()).slice(-2);
    let model = `${year}-${month}-${day}T${hour}:${minute}`;
    if (date.getSeconds() || date.getMilliseconds()) {
      let second = ("0" + date.getSeconds().toString()).slice(-2);
      model += `:${second}`;
    }
    if (date.getMilliseconds()) {
      let fraction = ("00" + date.getMilliseconds().toString()).slice(-3);
      model += `.${fraction}`;
    }
    return new Field(label, model, type, icon, options, visible);
  }

  getDate():Date {
    "use strict";

    let result = /^(\d{4,})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2})(?:.(\d+))?)?$/.exec(this.model);
    if (!result) {
      throw "invalid format";
    }

    let year = parseInt(result[1]);
    let month = parseInt(result[2]) - 1;
    let day = parseInt(result[3]);
    let hour = parseInt(result[4]);
    let minute = parseInt(result[5]);
    let second = result[6] ? parseInt(result[6]) : 0;
    let fraction = result[7] ? parseInt(result[7]) : 0;
    if (isNaN(year) || isNaN(month) || isNaN(day) || isNaN(hour) || isNaN(minute) || isNaN(second) || isNaN(fraction)) {
      throw "component not a number";
    }

    let date = new Date(year, month, day, hour, minute, second, fraction);
    if (date.getFullYear() != year || date.getMonth() != month || date.getDate() != day || date.getHours() != hour || date.getMinutes() != minute || date.getSeconds() != second || date.getMilliseconds() != fraction) {
      throw "component out of range";
    }

    return date;
  }
}

@ng.Component({
  selector: "[fields]",
  templateUrl: "app/lib-bootstrap/fields.html",
  directives: [fieldDefault.Component, ng.CORE_DIRECTIVES, ng.FORM_DIRECTIVES],
  inputs: ["fields"]
})
export class Component {

  @ng.Output()
  fieldChange = new ng.EventEmitter();

  onModelChange(field:Field):void {
    "use strict";

    this.fieldChange.next(field);
  }
}
