/*
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */

import * as ngCommon from "@angular/common";
import * as ngCore from "@angular/core";

import * as fieldInteractionsScheme from "./field-interactions-scheme";

export const EMPTY = JSON.stringify({body: "", interactions: null});

export function getInteractions(model:string):string {
  "use strict";

  return JSON.parse(model).interactions;
}

@ngCore.Component({
  selector: "[fieldIssueBody]",
  templateUrl: "app/lib-becki/field-issue-body.html",
  directives: [fieldInteractionsScheme.Component, ngCommon.CORE_DIRECTIVES, ngCommon.FORM_DIRECTIVES],
  inputs: ["fieldIssueBody", "required"]
})
export class Component implements ngCore.OnChanges {

  model = JSON.parse(EMPTY);

  @ngCore.Input()
  readonly = false;

  @ngCore.Output("fieldIssueBodyChange")
  // TODO: https://github.com/angular/angular/issues/6311
  modelChange = new ngCore.EventEmitter<string>(false);

  ngOnChanges(changes:{[key: string]: ngCore.SimpleChange}):void {
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
