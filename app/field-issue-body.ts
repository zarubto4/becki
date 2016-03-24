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

import * as fieldInteractionsScheme from "./field-interactions-scheme";

export const EMPTY = JSON.stringify({body: "", interactions: null});

export function getInteractions(model:string):string {
  "use strict";

  return JSON.parse(model).interactions;
}

@ng.Component({
  selector: "[field-issue-body]",
  templateUrl: "app/field-issue-body.html",
  directives: [fieldInteractionsScheme.Component, ng.CORE_DIRECTIVES, ng.FORM_DIRECTIVES],
  inputs: ["fieldIssueBody", "required"]
})
export class Component implements ng.OnChanges {

  model = JSON.parse(EMPTY);

  @ng.Input()
  readonly = false;

  @ng.Output("fieldIssueBodyChange")
  // TODO: https://github.com/angular/angular/issues/6311
  modelChange = new ng.EventEmitter(false);

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

  onInteractionsChange(value:string):void {
    "use strict";

    this.model.interactions = value;
    this.emitModelChange();
  }

  onInteractionsSchemeClick():void {
    "use strict";

    this.model.interactions = this.model.interactions == null ? '{\'blocks\':{}}' : null;
    this.emitModelChange();
  }

  emitModelChange():void {
    "use strict";

    this.modelChange.next(JSON.stringify(this.model));
  }
}
