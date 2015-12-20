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

import * as codeEditor from "./code-editor";

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

  editable:boolean;

  options:Option[];

  password:boolean;

  code:boolean;

  constructor(label:string, model:string, editable = true, options:Option[] = [], password = false, code = false) {
    "use strict";

    this.label = label;
    this.model = model;
    this.editable = editable;
    this.options = options;
    this.password = password;
    this.code = code;
  }
}

@ng.Component({
  selector: "[fields]",
  templateUrl: "app/lib-adminlte/fields.html",
  directives: [codeEditor.Component, ng.CORE_DIRECTIVES, ng.FORM_DIRECTIVES],
  inputs: ["fields"]
})
export class Component {
}
