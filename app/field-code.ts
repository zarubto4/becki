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

import "codemirror/mode/clike/clike";
import "codemirror/mode/javascript/javascript";

import * as CodeMirror from "codemirror";
import * as ng from "angular2/angular2";

@ng.Component({
  selector: "[field-code]",
  templateUrl: "app/field-code.html",
  directives: [ng.FORM_DIRECTIVES]
})
export class Component implements ng.AfterViewInit, ng.OnChanges, ng.OnDestroy {

  @ng.Input("fieldCode")
  model:string;

  @ng.Input()
  mode:string;

  @ng.ViewChild("field")
  field:ng.ElementRef;

  editor:CodeMirror.EditorFromTextArea;

  @ng.Output("fieldCodeChange")
  // TODO: https://github.com/angular/angular/issues/6311
  modelChange = new ng.EventEmitter(false);

  onChanges(changes:{[key: string]: ng.SimpleChange}):void {
    "use strict";

    let model = changes["model"];
    // see https://github.com/codemirror/CodeMirror/issues/3734
    // TODO: https://github.com/angular/angular/issues/6114
    if (model && this.editor && model.currentValue != this.editor.getDoc().getValue()) {
      this.editor.getDoc().setValue(model.currentValue);
    }
  }

  afterViewInit():void {
    "use strict";

    this.editor = CodeMirror.fromTextArea(this.field.nativeElement, {mode: this.mode});
    // see https://github.com/angular/angular/issues/6103
    // see https://github.com/codemirror/CodeMirror/issues/3735
    this.editor.on("changes", () => {
      this.model = this.editor.getDoc().getValue();
      this.modelChange.next(this.model);
    });
  }

  onDestroy():void {
    "use strict";

    this.editor.toTextArea();
  }
}
