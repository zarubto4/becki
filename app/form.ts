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
import * as libAdminlteForm from "./lib-adminlte/form";

@ng.Component({
  selector: "[fields]",
  templateUrl: "app/lib-adminlte/fields.html",
  directives: [fieldCustom.Component, ng.CORE_DIRECTIVES, ng.FORM_DIRECTIVES],
  inputs: ["fields"]
})
class Fields {
}

@ng.Component({
  selector: "[form]",
  templateUrl: "app/lib-adminlte/form.html",
  directives: [Fields, ng.FORM_DIRECTIVES],
  inputs: ["title: formTitle", "fields: form"]
})
export class Component extends libAdminlteForm.Component {
}
