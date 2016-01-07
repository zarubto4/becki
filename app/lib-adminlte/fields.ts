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

  options:Option[];

  constructor(label:string, model:string, type = "text", options:Option[] = []) {
    "use strict";

    this.label = label;
    this.model = model;
    this.type = type;
    this.options = options;
  }
}

@ng.Component({
  selector: "[fields]",
  templateUrl: "app/lib-adminlte/fields.html",
  directives: [fieldDefault.Component, ng.CORE_DIRECTIVES, ng.FORM_DIRECTIVES],
  inputs: ["fields"]
})
export class Component {
}
