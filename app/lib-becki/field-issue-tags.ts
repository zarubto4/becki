/*
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */

import * as ngCommon from "@angular/common";
import * as ngCore from "@angular/core";

export function parseTags(tags:string):string[] {
  "use strict";

  return tags.split(",").map(tag => tag.trim()).filter(tag => tag.length > 0);
}

@ngCore.Component({
  selector: "[fieldIssueTags]",
  templateUrl: "app/lib-becki/field-issue-tags.html",
  directives: [ngCommon.CORE_DIRECTIVES, ngCommon.FORM_DIRECTIVES]
})
export class Component {

  @ngCore.Input("fieldIssueTags")
  model:string;

  @ngCore.Output("fieldIssueTagsChange")
  // TODO: https://github.com/angular/angular/issues/6311
  modelChange = new ngCore.EventEmitter<string>(false);

  getTags():string[] {
    "use strict";

    return parseTags(this.model);
  }

  onModelChange(value:string):void {
    "use strict";

    this.model = value;
    this.modelChange.emit(value);
  }
}
