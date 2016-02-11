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

import * as fieldHomerProgram from "./field-homer-program";

export const EMPTY = JSON.stringify({body: "", homer: null});

export function getHomer(model:string):string {
  "use strict";

  return JSON.parse(model).homer;
}

@ng.Component({
  selector: "[field-issue-body]",
  templateUrl: "app/field-issue-body.html",
  directives: [fieldHomerProgram.Component, ng.CORE_DIRECTIVES, ng.FORM_DIRECTIVES],
  inputs: ["fieldIssueBody"]
})
export class Component implements ng.OnChanges {

  model = JSON.parse(EMPTY);

  @ng.Input()
  readonly = false;

  @ng.Output("fieldIssueBodyChange")
  modelChange = new ng.EventEmitter();

  onChanges(changes:{[key: string]: ng.SimpleChange}):void {
    "use strict";

    let modelChange = changes["fieldIssueBody"];
    if (modelChange) {
      this.model = JSON.parse(modelChange.currentValue);
    }
  }

  onBodyChange(value:string):void {
    "use strict";

    this.model.body = value;
    this.emitModelChange();
  }

  onHomerChange(value:string):void {
    "use strict";

    this.model.homer = value;
    this.emitModelChange();
  }

  onHomerProgramClick():void {
    "use strict";

    this.model.homer = this.model.homer == null ? '{\'blocks\':{}}' : null;
    this.emitModelChange();
  }

  emitModelChange():void {
    "use strict";

    this.modelChange.next(JSON.stringify(this.model));
  }
}
