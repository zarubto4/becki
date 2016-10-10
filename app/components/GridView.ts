/**
 * Created by davidhradek on 14.09.16.
 */
/*
 * © 2015-2016 Becki Authors. See the AUTHORS file found in the top-level
 * directory of this distribution.
 */

import {Core, Widgets, DeviceProfiles, EditorRenderer} from "the-grid";
import {
    Component, AfterViewInit, OnChanges, OnDestroy, Input, Output, ViewChild, ElementRef,
    EventEmitter, SimpleChanges
} from "@angular/core";
import {CORE_DIRECTIVES} from "@angular/common";
import {ModalService} from "../services/ModalService";
import {ModalsGridConfigPropertiesModel} from "../modals/grid-config-properties";

@Component({
    selector: "grid-view",
    template: `
    <div #screens></div>
`,
    directives: [CORE_DIRECTIVES]
})
export class GridView implements AfterViewInit, OnChanges {

    @Input()
    readonly:boolean = false;

    @Input()
    simpleMode:boolean = false;

    @Input()
    spy:string;

    @Input()
    widgets:HTMLElement;

    @ViewChild("screens")
    screens:ElementRef;

    protected gridController:Core.Controller;

    protected gridRenderer:EditorRenderer.ControllerRenderer;

    constructor(protected modalService:ModalService) {

        this.gridController = new Core.Controller();
        this.gridController.registerDataChangedCallback(() => {
            //this.modal.closeModal(false);
            console.log("CHANGED");
            //this.modelChange.emit(this.controller.getDataJson());
        });
        this.gridController.registerWidget(Widgets.TimeWidget);
        this.gridController.registerWidget(Widgets.LabelWidget);
        this.gridController.registerWidget(Widgets.WeatherWidget);
        this.gridController.registerWidget(Widgets.ButtonWidget);
        this.gridController.registerWidget(Widgets.FAButtonWidget);
        this.gridController.registerWidget(Widgets.KnobWidget);


    }

    ngOnChanges(changes:SimpleChanges):void {
        /*let device = changes["device"];
        if (device) {
            if (device.isFirstChange()) {
                this.controller.deviceProfile = new Core.DeviceProfile(device.currentValue.name, [
                    new Core.ScreenProfile("portrait", device.currentValue.portrait_width, device.currentValue.portrait_height, device.currentValue.portrait_square_width, device.currentValue.portrait_square_height, device.currentValue.portrait_min_screens, device.currentValue.portrait_max_screens),
                    new Core.ScreenProfile("landscape", device.currentValue.landscape_width, device.currentValue.landscape_height, device.currentValue.landscape_square_width, device.currentValue.landscape_square_height, device.currentValue.landscape_min_screens, device.currentValue.landscape_max_screens)
                ]);
            } else {
                //this.notifications.current.push(new notifications.Danger("The device cannot be changed."));
            }
        }*/
        /*let model = changes["model"];
        if (model) {
            if (model.isFirstChange()) {
                this.initialModel = model.currentValue;
            } else {
                this.controller.setDataJson(model.currentValue);
            }
        }*/
    }

    ngAfterViewInit():void {
        if (!this.gridController.deviceProfile) {
            this.gridController.deviceProfile = new DeviceProfiles.iPhone6();
        }

        this.gridRenderer = new EditorRenderer.ControllerRenderer(this.gridController, this.widgets, this.screens.nativeElement);
        this.gridRenderer.registerOpenConfigCallback(widget => {
            var m = new ModalsGridConfigPropertiesModel(widget);
            this.modalService.showModal(m);
                /*this.modal.showModal(new modal.WidgetModel(widget, this.readonly)).then(save => {
                 if (save) {
                 widget.emitOnConfigsChanged();
                 }
                 })*/
        });
        this.gridController.setRenderer(this.gridRenderer);
        /*if (this.initialModel) {
            this.gridController.setDataJson(this.initialModel);
        }*/
    }

}
