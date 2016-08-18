/*
 * © 2015-2016 Becki Authors. See the AUTHORS file found in the top-level
 * directory of this distribution.
 */

import * as blocko from "blocko";
import * as ngCommon from "@angular/common";
import * as ngCore from "@angular/core";

import * as backEnd from "./back-end";
import * as libBootstrapModal from "../modals/modal";
import * as modal from "./modal";
import * as notifications from "./notifications";

@ngCore.Component({
  selector: "[fieldInteractionsScheme]",
  templateUrl: "app/lib-becki/field-interactions-scheme.html",
  directives: [ngCommon.CORE_DIRECTIVES]
})
export class Component implements ngCore.AfterViewInit, ngCore.OnChanges, ngCore.OnDestroy {

  @ngCore.Input()
  readonly:boolean;

  @ngCore.Input()
  spy:string;

  fieldController:blocko.BlockoCore.Controller;

  fieldRenderer:blocko.BlockoSnapRenderer.RendererController;

  @ngCore.ViewChild("field")
  field:ngCore.ElementRef;

  @ngCore.Output("fieldInteractionsSchemeChange")
  modelChange:ngCore.EventEmitter<string>;

  backEnd:backEnd.Service;

  notifications:notifications.Service;

  @ngCore.Input("fieldInteractionsScheme")
  set model(scheme:string) {
    "use strict";

    this.fieldController.setDataJson(scheme);
  }

  constructor(backEndService:backEnd.Service, notificationsService:notifications.Service, modalComponent:libBootstrapModal.Component) {
    "use strict";

    this.readonly = false;
    this.fieldRenderer = new blocko.BlockoSnapRenderer.RendererController();
    this.fieldRenderer.registerOpenConfigCallback((block) =>
        modalComponent.showModal(new modal.BlockModel(block, this.readonly)).then(save => {
          if (save) {
            block.emitConfigsChanged();
          }
        })
    );
    this.fieldController = new blocko.BlockoCore.Controller();
    this.fieldController.rendererFactory = this.fieldRenderer;
    this.fieldController.registerDataChangedCallback(() => {
      modalComponent.closeModal(false);
      this.modelChange.emit(this.fieldController.getDataJson());
    });
    this.fieldController.registerBlocks(blocko.BlockoBasicBlocks.Manager.getAllBlocks());
    this.modelChange = new ngCore.EventEmitter<string>();
    this.backEnd = backEndService;
    this.backEnd.interactionsOpened.subscribe(() => {
      if (this.spy) {
        this.backEnd.requestInteractionsSchemeValues(this.spy);
      }
    });
    this.backEnd.interactionsSchemeSubscribed.subscribe(() => {
      if (this.spy) {
        this.backEnd.requestInteractionsSchemeValues(this.spy);
      }
    });
    this.backEnd.BProgramValuesReceived.subscribe(values => {
      if (this.spy) {
        Object.keys(values.digital).forEach(hwId => {
          this.fieldController.setDigitalValue(hwId, values.digital[hwId]);
        });
        Object.keys(values.analog).forEach(hwId => {
          this.fieldController.setAnalogValue(hwId, values.analog[hwId]);
        });
        Object.keys(values.connector).forEach(blockId => {
          let block = values.connector[blockId];
          Object.keys(block.inputs).forEach(connectorName => {
            this.fieldController.setInputConnectorValue(blockId, connectorName, block.inputs[connectorName]);
          });
          Object.keys(block.outputs).forEach(connectorName => {
            this.fieldController.setOutputConnectorValue(blockId, connectorName, block.outputs[connectorName]);
          });
        });
      }
    });
    this.backEnd.BProgramAnalogValueReceived.subscribe(value => {
      if (this.spy) {
        this.fieldController.setAnalogValue(value.hwId, value.value);
      }
    });
    this.backEnd.BProgramDigitalValueReceived.subscribe(value => {
      if (this.spy) {
        this.fieldController.setDigitalValue(value.hwId, value.value);
      }
    });
    this.backEnd.BProgramInputConnectorValueReceived.subscribe(value => {
      if (this.spy) {
        this.fieldController.setInputConnectorValue(value.blockId, value.connectorName, value.value);
      }
    });
    this.backEnd.BProgramOutputConnectorValueReceived.subscribe(value => {
      if (this.spy) {
        this.fieldController.setOutputConnectorValue(value.blockId, value.connectorName, value.value);
      }
    });
    this.notifications = notificationsService;
  }

  ngOnChanges(changes:ngCore.SimpleChanges):void {
    "use strict";

    let readonly = changes["readonly"];
    if (readonly && !readonly.isFirstChange()) {
      this.notifications.current.push(new notifications.Danger("The readability cannot be changed."));
      this.readonly = readonly.previousValue;
    }
    let spy = changes["spy"];
    if (spy && !spy.isFirstChange()) {
      if (spy.previousValue) {
        this.unsubscribeSpy(spy.previousValue);
      }
      if (spy.currentValue) {
        this.subscribeSpy(spy.currentValue);
      }
    }
  }

  ngAfterViewInit():void {
    "use strict";

    if (!this.readonly) {
      new blocko.BlockoBasicBlocks.ExecutionController(this.fieldController);
    }
    if (this.spy) {
      this.subscribeSpy(this.spy);
    }
    this.fieldRenderer.setEditorElement(this.field.nativeElement);
  }

  ngOnDestroy():void {
    "use strict";

    if (this.spy) {
      this.unsubscribeSpy(this.spy);
    }
  }

  subscribeSpy(spy:string):void {
    "use strict";

    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-262
    this.notifications.current.push(new notifications.Danger("issue/TYRION-262"));
    this.backEnd.subscribeBProgram(spy);
  }

  unsubscribeSpy(spy:string):void {
    "use strict";

    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-261
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
