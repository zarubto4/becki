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

import * as ng from "angular2/angular2";
import * as theGrid from "the-grid";

import * as libPatternFlyNotifications from "./lib-patternfly/notifications";

@ng.Component({
  selector: "[field-application]",
  templateUrl: "app/field-application.html",
  directives: [ng.CORE_DIRECTIVES, ng.FORM_DIRECTIVES],
  inputs: ["model: fieldApplication", "device"]
})
export class Component implements ng.AfterViewInit, ng.OnChanges {

  initialModel:string;

  controller:theGrid.Core.Controller;

  @ng.Input()
  readonly:boolean;

  @ng.ViewChild("toolbar")
  toolbar:ng.ElementRef;

  @ng.ViewChild("screens")
  screens:ng.ElementRef;

  config:theGrid.Core.Widget;

  @ng.Output("fieldApplicationChange")
  modelChange:ng.EventEmitter;

  notifications:libPatternFlyNotifications.Service;

  constructor(notifications:libPatternFlyNotifications.Service) {
    "use strict";

    this.controller = new theGrid.Core.Controller();
    this.controller.registerDataChangedCallback(() => {
      this.config = null;
      this.modelChange.next(this.controller.getDataJson());
    });
    this.controller.registerWidget(theGrid.Widgets.TimeWidget);
    this.controller.registerWidget(theGrid.Widgets.LabelWidget);
    this.controller.registerWidget(theGrid.Widgets.WeatherWidget);
    this.controller.registerWidget(theGrid.Widgets.ButtonWidget);
    this.controller.registerWidget(theGrid.Widgets.FAButtonWidget);
    this.controller.registerWidget(theGrid.Widgets.KnobWidget);
    this.readonly = false;
    this.config = null;
    // TODO: https://github.com/angular/angular/issues/6311
    this.modelChange = new ng.EventEmitter(false);
    this.notifications = notifications;
  }

  onChanges(changes:{[key:string]: ng.SimpleChange}):void {
    "use strict";

    let device = changes["device"];
    if (device) {
      if (device.isFirstChange()) {
        this.controller.deviceProfile = new theGrid.Core.DeviceProfile(device.currentValue.name, [
          new theGrid.Core.ScreenProfile("portrait", device.currentValue.width, device.currentValue.height, 6, 11, 1, 10),
          new theGrid.Core.ScreenProfile("landscape", device.currentValue.height, device.currentValue.width, 11, 6, 1, 10)
        ]);
      } else {
        this.notifications.current.push(new libPatternFlyNotifications.Danger("The device cannot be changed."));
      }
    }
    let model = changes["model"];
    if (model) {
      if (model.isFirstChange()) {
        this.initialModel = model.currentValue;
      } else {
        this.controller.setDataJson(model.currentValue);
      }
    }
  }

  afterViewInit():void {
    "use strict";

    if (!this.controller.deviceProfile) {
      this.controller.deviceProfile = new theGrid.DeviceProfiles.iPhone6();
    }
    let renderer = new theGrid.EditorRenderer.ControllerRenderer(this.controller, this.toolbar.nativeElement, this.screens.nativeElement);
    renderer.registerOpenConfigCallback(widget =>
      this.config = widget
    );
    this.controller.setRenderer(renderer);
    if (this.initialModel) {
      this.controller.setDataJson(this.initialModel);
    }
  }

  getPropertyType(property:theGrid.Core.ConfigProperty):string {
    "use strict";

    switch (property.type) {
      case theGrid.Core.ConfigPropertyType.Integer:
        return "int";
      case theGrid.Core.ConfigPropertyType.Float:
        return "float";
      case theGrid.Core.ConfigPropertyType.String:
        return "text";
      case theGrid.Core.ConfigPropertyType.Boolean:
        return "bool";
      default:
        return null;
    }
  }

  onConfigSaveClick():void {
    "use strict";

    if (this.readonly) {
      throw new Error("read only");
    }
    this.config.emitOnConfigsChanged();
  }

  onConfigCloseClick():void {
    "use strict";

    this.config = null;
  }
}
