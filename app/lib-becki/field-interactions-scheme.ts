/*
 * © 2015-2016 Becki Authors. See the AUTHORS file found in the top-level
 * directory of this distribution.
 */

import * as blocko from "blocko";
import * as ngCommon from "@angular/common";
import * as ngCore from "@angular/core";

import * as modal from "./modal";

@ngCore.Component({
  selector: "[fieldInteractionsScheme]",
  templateUrl: "app/lib-becki/field-interactions-scheme.html",
  directives: [ngCommon.CORE_DIRECTIVES]
})
export class Component implements ngCore.AfterViewInit {

  @ngCore.Input()
  readonly:boolean;

  controller:blocko.BlockoCore.Controller;

  @ngCore.ViewChild("field")
  field:ngCore.ElementRef;

  @ngCore.Output("fieldInteractionsSchemeChange")
  modelChange:ngCore.EventEmitter<string>;

  modal:modal.Service;

  @ngCore.Input("fieldInteractionsScheme")
  set model(scheme:string) {
    "use strict";

    this.controller.setDataJson(scheme);
  }

  constructor(modalService:modal.Service) {
    "use strict";

    this.readonly = false;
    this.controller = new blocko.BlockoCore.Controller();
    this.controller.registerDataChangedCallback(() => {
      this.modal.modalChange.next(null);
      this.modelChange.next(this.controller.getDataJson());
    });
    this.controller.registerBlocks(blocko.BlockoBasicBlocks.Manager.getAllBlocks());
    // TODO: https://github.com/angular/angular/issues/6311
    this.modelChange = new ngCore.EventEmitter<string>(false);
    this.modal = modalService;
  }

  ngAfterViewInit():void {
    "use strict";

    let renderer = new blocko.BlockoSnapRenderer.RendererController(this.field.nativeElement);
    renderer.registerOpenConfigCallback((block) =>
        this.modal.modalChange.next(new modal.BlockEvent(block, this.readonly))
    );
    this.controller.rendererFactory = renderer;
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
  }

  onClearClick():void {
    "use strict";

    if (this.readonly) {
      throw new Error("read only");
    }
    this.controller.removeAllBlocks();
  }
}
