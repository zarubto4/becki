/*
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */

import "ace";
import "ace/mode-c_cpp";
import "ace/mode-javascript";

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

  editor:AceAjax.Editor;

  @ngCore.Output("fieldCodeChange")
  modelChange = new ngCore.EventEmitter<string>();

  ngOnChanges(changes:ngCore.SimpleChanges):void {
    "use strict";

    let model = changes["model"];
    // TODO: https://github.com/angular/angular/issues/6114
    if (model && this.editor && model.currentValue != this.editor.getValue()) {
      this.editor.setValue(model.currentValue, 1);
    }
    let mode = changes["mode"];
    if (mode && this.editor) {
      this.editor.getSession().setMode(mode.currentValue);
    }
    let readonly = changes["readonly"];
    if (readonly && this.editor) {
      this.editor.setReadOnly(readonly.currentValue);
    }
  }

  ngAfterViewInit():void {
    "use strict";

    this.editor = ace.edit(this.field.nativeElement);
    this.editor.setReadOnly(this.readonly);
    this.editor.getSession().setMode(this.mode);
    this.editor.getSession().on("change", () => {
      this.model = this.editor.getValue();
      this.modelChange.emit(this.model);
    });
  }

  ngOnDestroy():void {
    "use strict";

    this.editor.destroy();
  }
}
