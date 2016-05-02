/*
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */

import * as ng from "angular2/angular2";

export function parseTags(tags:string):string[] {
  "use strict";

  return tags.split(",").map(tag => tag.trim()).filter(tag => tag.length > 0);
}

@ng.Component({
  selector: "[field-issue-tags]",
  templateUrl: "app/lib-becki/field-issue-tags.html",
  directives: [ng.CORE_DIRECTIVES, ng.FORM_DIRECTIVES]
})
export class Component {

  @ng.Input("fieldIssueTags")
  model:string;

  @ng.Output("fieldIssueTagsChange")
  // TODO: https://github.com/angular/angular/issues/6311
  modelChange = new ng.EventEmitter(false);

  getTags():string[] {
    "use strict";

    return parseTags(this.model);
  }

  onModelChange(value:string):void {
    "use strict";

    this.model = value;
    this.modelChange.next(value);
  }
}
