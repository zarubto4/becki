/*
 * © 2015-2016 Becki Authors. See the AUTHORS file found in the top-level
 * directory of this distribution.
 */

import * as blocko from "blocko";
import * as ngCommon from "@angular/common";
import * as ngCore from "@angular/core";

import * as modal from "./modal";
import * as notifications from "./notifications";

@ngCore.Component({
  selector: "[fieldInteractionsScheme]",
  templateUrl: "app/lib-becki/field-interactions-scheme.html",
  directives: [ngCommon.CORE_DIRECTIVES]
})
export class Component implements ngCore.AfterViewInit, ngCore.OnChanges {

  @ngCore.Input()
  readonly:boolean;

  fieldController:blocko.BlockoCore.Controller;

  fieldRenderer:blocko.BlockoSnapRenderer.RendererController;

  @ngCore.ViewChild("field")
  field:ngCore.ElementRef;

  @ngCore.Output("fieldInteractionsSchemeChange")
  modelChange:ngCore.EventEmitter<string>;

  notifications:notifications.Service;

  modal:modal.Service;

  @ngCore.Input("fieldInteractionsScheme")
  set model(scheme:string) {
    "use strict";

    this.fieldController.setDataJson(scheme);
  }

  constructor(notificationsService:notifications.Service, modalService:modal.Service) {
    "use strict";

    this.readonly = false;
    this.fieldRenderer = new blocko.BlockoSnapRenderer.RendererController();
    this.fieldRenderer.registerOpenConfigCallback((block) =>
        this.modal.modalChange.emit(new modal.BlockEvent(block, this.readonly))
    );
    this.fieldController = new blocko.BlockoCore.Controller();
    this.fieldController.rendererFactory = this.fieldRenderer;
    this.fieldController.registerDataChangedCallback(() => {
      this.modal.modalChange.emit(null);
      this.modelChange.emit(this.fieldController.getDataJson());
    });
    this.fieldController.registerBlocks(blocko.BlockoBasicBlocks.Manager.getAllBlocks());
    // TODO: https://github.com/angular/angular/issues/6311
    this.modelChange = new ngCore.EventEmitter<string>(false);
    this.notifications = notificationsService;
    this.modal = modalService;
  }

  ngOnChanges(changes:{[key:string]: ngCore.SimpleChange}):void {
    "use strict";

    let readonly = changes["readonly"];
    if (readonly && !readonly.isFirstChange()) {
      this.notifications.current.push(new notifications.Danger("The readability cannot be changed."));
      this.readonly = readonly.previousValue;
    }
  }

  ngAfterViewInit():void {
    "use strict";

    if (!this.readonly) {
      new blocko.BlockoBasicBlocks.ExecutionController(this.fieldController);
    }
    this.fieldRenderer.setEditorElement(this.field.nativeElement);
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
    this.fieldController.addBlock(new cls(this.fieldController.getFreeBlockId()));
  }

  onClearClick():void {
    "use strict";

    if (this.readonly) {
      throw new Error("read only");
    }
    this.fieldController.removeAllBlocks();
  }
}
