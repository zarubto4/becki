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

import * as blocko from "blocko";
import * as ng from "angular2/angular2";

import * as fieldCode from "./field-code";

@ng.Component({
  selector: "[field-homer-program]",
  templateUrl: "app/field-homer-program.html",
  directives: [fieldCode.Component, ng.CORE_DIRECTIVES, ng.FORM_DIRECTIVES]
})
export class Component implements ng.AfterViewInit {

  @ng.Input()
  readonly:boolean;

  controller:blocko.BlockoCore.Controller;

  @ng.ViewChild("field")
  field:ng.ElementRef;

  config:blocko.BlockoCore.Block;

  @ng.Output("fieldHomerProgramChange")
  modelChange:ng.EventEmitter;

  @ng.Input("fieldHomerProgram")
  set model(code:string) {
    "use strict";

    // TODO: https://github.com/angular/angular/issues/6114
    // TODO: https://github.com/angular/angular/issues/6311
    if (code != this.controller.getDataJson()) {
      this.controller.setDataJson(code);
    }
  }

  constructor() {
    "use strict";

    this.readonly = false;
    this.controller = new blocko.BlockoCore.Controller();
    this.controller.registerDataChangedCallback(() => {
      this.config = null;
      // TODO: https://youtrack.byzance.cz/youtrack/issue/BLOCKO-1
      //this.modelChange.next(this.controller.getDataJson());
    });
    this.controller.registerBlocks(blocko.BlockoBasicBlocks.Manager.getAllBlocks());
    this.config = null;
    this.modelChange = new ng.EventEmitter();
  }

  afterViewInit():void {
    "use strict";

    let renderer = new blocko.BlockoSnapRenderer.RendererController(this.field.nativeElement);
    renderer.registerOpenConfigCallback((block) =>
        this.config = block
    );
    this.controller.registerFactoryBlockRendererCallback((block) =>
        new blocko.BlockoSnapRenderer.BlockRenderer(renderer, block)
    );
    this.controller.registerFactoryConnectionRendererCallback((connection) =>
        new blocko.BlockoSnapRenderer.ConnectionRenderer(renderer, connection)
    );
    // TODO: https://youtrack.byzance.cz/youtrack/issue/BLOCKO-2
    this.controller.setDataJson(this.controller.getDataJson());
  }

  onSwitchClick():void {
    "use strict";

    this.addBlock(blocko.BlockoBasicBlocks.Switch);
  }

  onButtonClick():void {
    "use strict";

    this.addBlock(blocko.BlockoBasicBlocks.PushButton);
  }

  onLightClick():void {
    "use strict";

    this.addBlock(blocko.BlockoBasicBlocks.Light);
  }

  onInputClick():void {
    "use strict";

    this.addBlock(blocko.BlockoBasicBlocks.AnalogInput);
  }

  onOutputClick():void {
    "use strict";

    this.addBlock(blocko.BlockoBasicBlocks.AnalogOutput);
  }

  onAndClick():void {
    "use strict";

    this.addBlock(blocko.BlockoBasicBlocks.And);
  }

  onOrClick():void {
    "use strict";

    this.addBlock(blocko.BlockoBasicBlocks.Or);
  }

  onXorClick():void {
    "use strict";

    this.addBlock(blocko.BlockoBasicBlocks.Xor);
  }

  onNotClick():void {
    "use strict";

    this.addBlock(blocko.BlockoBasicBlocks.Not);
  }

  onFlipFlopClick():void {
    "use strict";

    this.addBlock(blocko.BlockoBasicBlocks.FlipFlop);
  }

  onDelayClick():void {
    "use strict";

    this.addBlock(blocko.BlockoBasicBlocks.DelayTimer);
  }

  onAsyncClick():void {
    "use strict";

    this.addBlock(blocko.BlockoBasicBlocks.AsyncGenerator);
  }

  onRangeClick():void {
    "use strict";

    this.addBlock(blocko.BlockoBasicBlocks.AnalogRange);
  }

  onCustomClick():void {
    "use strict";

    this.addBlock(blocko.BlockoBasicBlocks.JSBlock);
  }

  addBlock(cls:blocko.BlockoCore.BlockClass):void {
    "use strict";

    if (this.readonly) {
      throw new Error("read only");
    }
    this.controller.addBlock(new cls(this.controller.getFreeBlockId()));
    // TODO: https://youtrack.byzance.cz/youtrack/issue/BLOCKO-1
    this.modelChange.next(this.controller.getDataJson());
  }

  onClearClick():void {
    "use strict";

    if (this.readonly) {
      throw new Error("read only");
    }
    this.controller.removeAllBlocks();
    // TODO: https://youtrack.byzance.cz/youtrack/issue/BLOCKO-1
    this.modelChange.next(this.controller.getDataJson());
  }

  getPropertyType(property:blocko.BlockoCore.ConfigProperty):string {
    "use strict";

    switch (property.type) {
      case blocko.BlockoCore.ConfigPropertyType.Integer:
        return "int";
      case blocko.BlockoCore.ConfigPropertyType.Float:
        return "float";
      case blocko.BlockoCore.ConfigPropertyType.String:
        return "text";
      case blocko.BlockoCore.ConfigPropertyType.Boolean:
        return "bool";
      case blocko.BlockoCore.ConfigPropertyType.JSString:
        return "javascript";
      default:
        return null;
    }
  }

  onConfigSaveClick():void {
    "use strict";

    if (this.readonly) {
      throw new Error("read only");
    }
    this.config.emitConfigsChanged();
    // TODO: https://youtrack.byzance.cz/youtrack/issue/BLOCKO-1
    this.modelChange.next(this.controller.getDataJson());
  }

  onConfigCloseClick():void {
    "use strict";

    this.config = null;
  }
}
