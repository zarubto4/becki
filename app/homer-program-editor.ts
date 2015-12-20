/*
 * © 2015 Becki Authors. See the AUTHORS file found in the top-level directory
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

import * as _ from "underscore";
import * as blocko from "blocko";
import * as ng from "angular2/angular2";

import * as libAdminlteFields from "./lib-adminlte/fields";
import * as libAdminlteForm from "./lib-adminlte/form";

@ng.Component({
  selector: "[data-code-editor]",
  templateUrl: "app/homer-program-editor.html",
  directives: [libAdminlteForm.Component, ng.CORE_DIRECTIVES]
})
export class Component implements ng.AfterViewInit {

  controller = blocko.BlockoCore.Controller.getInstance();

  @ng.ViewChild("field")
  field:ng.ElementRef;

  config:{block: blocko.BlockoCore.Block, fields: libAdminlteFields.Field[]} = null;

  @ng.Output("dataCodeEditorChange")
  modelChange = new ng.EventEmitter();

  @ng.Input("dataCodeEditor")
  set model(code:string) {
    "use strict";

    this.controller.setDataJson(code);
    this.config = null;
    // TODO
    this.modelChange.next(this.controller.getDataJson());
  }

  get configTitle():string {
    "use strict";

    return this.config ? `Configuration of ${this.config.block.id}` : null;
  }

  afterViewInit():void {
    "use strict";

    let target = this.field.nativeElement;
    // TODO
    while (target.hasChildNodes()) {
      target.removeChild(target.lastChild);
    }
    let renderer = new blocko.BlockoSnapRenderer.RendererController(target);
    renderer.registerOpenConfigCallback((block) => {
      this.config = {
        block,
        fields: block.getConfigProperties().map(property => new libAdminlteFields.Field(`${property.displayName}:`, property.value.toString()))
      };
    });
    this.controller.registerFactoryBlockRendererCallback((block) =>
        new blocko.BlockoSnapRenderer.BlockRenderer(renderer, block)
    );
    this.controller.registerFactoryConnectionRendererCallback((connection) =>
        new blocko.BlockoSnapRenderer.ConnectionRenderer(renderer, connection)
    );
    this.controller.registerBlocks(blocko.BlockoBasicBlocks.Manager.getAllBlocks());
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

    this.controller.addBlock(new cls(this.controller.getFreeBlockId()));
    // TODO
    this.modelChange.next(this.controller.getDataJson());
  }

  onClearClick():void {
    "use strict";

    this.controller.removeAllBlocks();
    this.config = null;
    // TODO
    this.modelChange.next(this.controller.getDataJson());
  }

  onConfigSubmit():void {
    "use strict";

    _.zip(this.config.block.getConfigProperties(), this.config.fields).forEach(property_field => {
      switch (property_field[0].type) {
        case blocko.BlockoCore.ConfigPropertyType.Integer:
          property_field[0].value = parseInt(property_field[1].model, 10);
          break;
        case blocko.BlockoCore.ConfigPropertyType.Float:
          property_field[0].value = parseFloat(property_field[1].model);
          break;
        case blocko.BlockoCore.ConfigPropertyType.Boolean:
          property_field[0].value = property_field[1].model.toLowerCase() == "true";
          break;
        default:
          property_field[0].value = property_field[1].model;
      }
    });
    this.config.block.emitConfigsChanged();
    this.config = null;
    // TODO
    this.modelChange.next(this.controller.getDataJson());
  }

  onConfigCancel():void {
    "use strict";

    this.config = null;
  }
}
