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

import * as CodeMirror from "codemirror";
import * as ng from "angular2/angular2";

@ng.Component({
  selector: "[field-device-program]",
  templateUrl: "app/field-device-program.html",
  directives: [ng.FORM_DIRECTIVES]
})
export class Component implements ng.AfterViewInit, ng.OnChanges, ng.OnDestroy {

  @ng.Input("fieldDeviceProgram")
  model:string;

  @ng.ViewChild("field")
  field:ng.ElementRef;

  editor:CodeMirror.EditorFromTextArea;

  @ng.Output("fieldDeviceProgramChange")
  modelChange = new ng.EventEmitter();

  onChanges(changes:{[key: string]: ng.SimpleChange}):void {
    "use strict";

    let model = changes["model"];
    // see https://github.com/codemirror/CodeMirror/issues/3734
    // TODO: https://github.com/angular/angular/issues/6114
    // TODO: https://github.com/angular/angular/issues/6311
    if (model && this.editor && !this.editor.hasFocus()) {
      this.editor.getDoc().setValue(model.currentValue);
    }
  }

  afterViewInit():void {
    "use strict";

    this.editor = CodeMirror.fromTextArea(this.field.nativeElement, {mode: "text/x-csrc"});
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
