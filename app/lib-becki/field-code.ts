/*
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */

import "codemirror/mode/clike/clike";
import "codemirror/mode/javascript/javascript";

import * as CodeMirror from "codemirror";
import * as ngCommon from "@angular/common";
import * as ngCore from "@angular/core";

@ngCore.Component({
  selector: "[fieldCode]",
  templateUrl: "app/lib-becki/field-code.html",
  directives: [ngCommon.FORM_DIRECTIVES]
})
export class Component implements ngCore.AfterViewInit, ngCore.OnChanges, ngCore.OnDestroy {

  @ngCore.Input("fieldCode")
  model:string;

  @ngCore.Input()
  mode:string;

  @ngCore.Input()
  readonly:boolean;

  @ngCore.ViewChild("field")
  field:ngCore.ElementRef;

  editor:CodeMirror.EditorFromTextArea;

  @ngCore.Output("fieldCodeChange")
  // TODO: https://github.com/angular/angular/issues/6311
  modelChange = new ngCore.EventEmitter<string>(false);

  ngOnChanges(changes:{[key: string]: ngCore.SimpleChange}):void {
    "use strict";

    let model = changes["model"];
    // see https://github.com/codemirror/CodeMirror/issues/3734
    // TODO: https://github.com/angular/angular/issues/6114
    if (model && this.editor && model.currentValue != this.editor.getDoc().getValue()) {
      this.editor.getDoc().setValue(model.currentValue);
    }
  }

  ngAfterViewInit():void {
    "use strict";

    this.editor = CodeMirror.fromTextArea(this.field.nativeElement, {mode: this.mode, readOnly: this.readonly ? "nocursor" : false});
    // see https://github.com/angular/angular/issues/6103
    // see https://github.com/codemirror/CodeMirror/issues/3735
    this.editor.on("changes", () => {
      this.model = this.editor.getDoc().getValue();
      this.modelChange.next(this.model);
    });
  }

  ngOnDestroy():void {
    "use strict";

    this.editor.toTextArea();
  }
}
