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
    widgets:HTMLElement;

    @ViewChild("screens")
    screens:ElementRef;

    protected gridController:Core.Controller;

    protected gridRenderer:EditorRenderer.ControllerRenderer;

    constructor(protected modalService:ModalService) {

        this.gridController = new Core.Controller();
        /*this.gridController.registerDataChangedCallback(() => {
            //this.modal.closeModal(false);
            console.log("CHANGED");
            //this.modelChange.emit(this.controller.getDataJson());
        });*/
        this.gridController.registerWidget(Widgets.TimeWidget);
        this.gridController.registerWidget(Widgets.LabelWidget);
        this.gridController.registerWidget(Widgets.WeatherWidget);
        this.gridController.registerWidget(Widgets.ButtonWidget);
        this.gridController.registerWidget(Widgets.FAButtonWidget);
        this.gridController.registerWidget(Widgets.KnobWidget);
        Core.Controller.cleanWidgetIONameCounter();

    }

    ngOnChanges(changes:SimpleChanges):void {
    }

    ngAfterViewInit():void {
        if (!this.gridController.deviceProfile) {
            this.gridController.deviceProfile = new DeviceProfiles.iPhone6();
        }

        this.gridRenderer = new EditorRenderer.ControllerRenderer(this.gridController, this.widgets, this.screens.nativeElement);
        this.gridRenderer.registerOpenConfigCallback(widget => {
            var m = new ModalsGridConfigPropertiesModel(widget);
            this.modalService.showModal(m);
        });
        this.gridController.setRenderer(this.gridRenderer);
    }

    getDataJson():string {
        return this.gridController.getDataJson();
    }

    setDataJson(data:string):void {
        this.gridController.setDataJson(data);
    }

    getInterfaceJson():string {
        return JSON.stringify(this.gridController.getInterface());
    }

}
