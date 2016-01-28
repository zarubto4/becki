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

import * as fieldCode from "./field-code";
import * as fieldHomerProgram from "./field-homer-program";
import * as libBootstrapFieldDefault from "./lib-bootstrap/field-default";

@ng.Component({
  selector: "[field-custom]",
  templateUrl: "app/field-custom.html",
  directives: [
    fieldCode.Component,
    fieldHomerProgram.Component,
    libBootstrapFieldDefault.Component,
    ng.CORE_DIRECTIVES],
  inputs: ["model: fieldCustom", "type: fieldType"]
})
export class Component {

  @ng.Output("fieldCustomChange")
  modelChange = new ng.EventEmitter();

  onModelChange(value:any):void {
    "use strict";

    this.modelChange.next(value);
  }
}
