/*
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */

import * as ngCore from "@angular/core";
import * as theGrid from "the-grid";

import * as modal from "./modal";
import * as notifications from "./notifications";

@ngCore.Component({
  selector: "[fieldApplication]",
  templateUrl: "app/lib-becki/field-application.html",
  inputs: ["model: fieldApplication", "device"]
})
export class Component implements ngCore.AfterViewInit, ngCore.OnChanges {

  initialModel:string;

  controller:theGrid.Core.Controller;

  @ngCore.Input()
  readonly:boolean;

  @ngCore.ViewChild("toolbar")
  toolbar:ngCore.ElementRef;

  @ngCore.ViewChild("screens")
  screens:ngCore.ElementRef;

  @ngCore.Output("fieldApplicationChange")
  modelChange:ngCore.EventEmitter<string>;

  modal:modal.Service;

  notifications:notifications.Service;

  constructor(modalService:modal.Service, notificationsService:notifications.Service) {
    "use strict";

    this.controller = new theGrid.Core.Controller();
    this.controller.registerDataChangedCallback(() => {
      this.modal.modalChange.emit(null);
      this.modelChange.emit(this.controller.getDataJson());
    });
    this.controller.registerWidget(theGrid.Widgets.TimeWidget);
    this.controller.registerWidget(theGrid.Widgets.LabelWidget);
    this.controller.registerWidget(theGrid.Widgets.WeatherWidget);
    this.controller.registerWidget(theGrid.Widgets.ButtonWidget);
    this.controller.registerWidget(theGrid.Widgets.FAButtonWidget);
    this.controller.registerWidget(theGrid.Widgets.KnobWidget);
    this.readonly = false;
    // TODO: https://github.com/angular/angular/issues/6311
    this.modelChange = new ngCore.EventEmitter<string>(false);
    this.modal = modalService;
    this.notifications = notificationsService;
  }

  ngOnChanges(changes:{[key:string]: ngCore.SimpleChange}):void {
    "use strict";

    let device = changes["device"];
    if (device) {
      if (device.isFirstChange()) {
        this.controller.deviceProfile = new theGrid.Core.DeviceProfile(device.currentValue.name, [
          new theGrid.Core.ScreenProfile("portrait", device.currentValue.portrait_width, device.currentValue.portrait_height, device.currentValue.portrait_square_width, device.currentValue.portrait_square_height, device.currentValue.portrait_min_screens, device.currentValue.portrait_max_screens),
          new theGrid.Core.ScreenProfile("landscape", device.currentValue.landscape_width, device.currentValue.landscape_height, device.currentValue.landscape_square_width, device.currentValue.landscape_square_height, device.currentValue.landscape_min_screens, device.currentValue.landscape_max_screens)
        ]);
      } else {
        this.notifications.current.push(new notifications.Danger("The device cannot be changed."));
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

  ngAfterViewInit():void {
    "use strict";

    if (!this.controller.deviceProfile) {
      this.controller.deviceProfile = new theGrid.DeviceProfiles.iPhone6();
    }
    let renderer = new theGrid.EditorRenderer.ControllerRenderer(this.controller, this.toolbar.nativeElement, this.screens.nativeElement);
    renderer.registerOpenConfigCallback(widget =>
      this.modal.modalChange.emit(new modal.WidgetEvent(widget, this.readonly))
    );
    this.controller.setRenderer(renderer);
    if (this.initialModel) {
      this.controller.setDataJson(this.initialModel);
    }
  }
}
