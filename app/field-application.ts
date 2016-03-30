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
import * as modal from "./modal";

@ng.Component({
  selector: "[field-application]",
  templateUrl: "app/field-application.html",
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

  @ng.Output("fieldApplicationChange")
  modelChange:ng.EventEmitter;

  modal:modal.Service;

  notifications:libPatternFlyNotifications.Service;

  constructor(modalService:modal.Service, notifications:libPatternFlyNotifications.Service) {
    "use strict";

    this.controller = new theGrid.Core.Controller();
    this.controller.registerDataChangedCallback(() => {
      this.modal.modalChange.next(null);
      this.modelChange.next(this.controller.getDataJson());
    });
    this.controller.registerWidget(theGrid.Widgets.TimeWidget);
    this.controller.registerWidget(theGrid.Widgets.LabelWidget);
    this.controller.registerWidget(theGrid.Widgets.WeatherWidget);
    this.controller.registerWidget(theGrid.Widgets.ButtonWidget);
    this.controller.registerWidget(theGrid.Widgets.FAButtonWidget);
    this.controller.registerWidget(theGrid.Widgets.KnobWidget);
    this.readonly = false;
    // TODO: https://github.com/angular/angular/issues/6311
    this.modelChange = new ng.EventEmitter(false);
    this.modal = modalService;
    this.notifications = notifications;
  }

  onChanges(changes:{[key:string]: ng.SimpleChange}):void {
    "use strict";

    let device = changes["device"];
    if (device) {
      if (device.isFirstChange()) {
        this.controller.deviceProfile = new theGrid.Core.DeviceProfile(device.currentValue.name, [
          new theGrid.Core.ScreenProfile("portrait", device.currentValue.portrait_width, device.currentValue.portrait_height, device.currentValue.portrait_square_width, device.currentValue.portrait_square_height, device.currentValue.portrait_min_screens, device.currentValue.portrait_max_screens),
          new theGrid.Core.ScreenProfile("landscape", device.currentValue.landscape_width, device.currentValue.landscape_height, device.currentValue.landscape_square_width, device.currentValue.landscape_square_height, device.currentValue.landscape_min_screens, device.currentValue.landscape_max_screens)
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
      this.modal.modalChange.next(new modal.WidgetEvent(widget, this.readonly))
    );
    this.controller.setRenderer(renderer);
    if (this.initialModel) {
      this.controller.setDataJson(this.initialModel);
    }
  }
}
