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

import * as fieldDeviceProgram from "./field-device-program";
import * as fieldHomerProgram from "./field-homer-program";
import * as libAdminlteFieldDefault from "./lib-adminlte/field-default";

@ng.Component({
  selector: "[field-custom]",
  templateUrl: "app/field-custom.html",
  directives: [
    fieldDeviceProgram.Component,
    fieldHomerProgram.Component,
    libAdminlteFieldDefault.Component,
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
