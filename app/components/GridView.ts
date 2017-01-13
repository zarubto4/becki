/**
 * Created by davidhradek on 14.09.16.
 */
/*
 * © 2015-2016 Becki Authors. See the AUTHORS file found in the top-level
 * directory of this distribution.
 */

import {Core, Widgets, DeviceProfiles, EditorRenderer} from "the-grid";
import { Component, AfterViewInit, OnChanges, Input, Output, ViewChild, ElementRef, SimpleChanges, EventEmitter } from '@angular/core';
import {ModalService} from "../services/ModalService";
import {ModalsGridConfigPropertiesModel} from "../modals/grid-config-properties";

@Component({
    selector: "grid-view",
    template: `
    <div #screens></div>
`
})
export class GridView implements AfterViewInit, OnChanges {

    @ViewChild("screens")
    screens: ElementRef;

    @Output()
    onRequestWidgetSource = new EventEmitter<{type: any, resolve: (name: string) => void}>();

    protected gridController: Core.Controller;

    protected gridRenderer: EditorRenderer.ControllerRenderer;

    constructor(protected modalService: ModalService) {

        this.gridController = new Core.Controller();

        this.gridController.registerRequestWidgetSourceCallback((type, resolve) => {
            this.onRequestWidgetSource.emit({
                type: type, 
                resolve: resolve
            });
        });

        /*this.gridController.registerDataChangedCallback(() => {
         //this.modal.closeModal(false);
            console.log("CHANGED");
         //this.modelChange.emit(this.controller.getDataJson());
         });*/

        this.gridController.registerWidgetService(Widgets.TimeService);
        Core.Controller.cleanWidgetIONameCounter();

    }

    requestCreateWidget(type: any, event?: MouseEvent):EditorRenderer.WidgetDragHandler {
        return (<EditorRenderer.ControllerRenderer>this.gridController.renderer).requestCreateWidget(type, event);
    }

    ngOnChanges(changes: SimpleChanges): void {
    }

    ngAfterViewInit(): void {
        //if (!this.gridController.deviceProfile) {
            //this.gridController.deviceProfile = new DeviceProfiles.iPhone6();
        //}

        this.gridRenderer = new EditorRenderer.ControllerRenderer(this.gridController, this.screens.nativeElement);
        this.gridRenderer.registerOpenConfigCallback(widget => {
            var m = new ModalsGridConfigPropertiesModel(widget);
            this.modalService.showModal(m);
        });
        this.gridController.setRenderer(this.gridRenderer);
    }

    addPage(): void {
        this.gridController.addPage();
    }

    getDataJson(): string {
        return this.gridController.getDataJson();
    }

    setDataJson(data: string): void {
        this.gridController.setDataJson(data);
    }

    setDeviceProfile(deviceProfile: string): void {
        this.gridController.setDeviceProfileByName(deviceProfile);
    }

    getDeviceProfile(): string {
        return this.gridController.deviceProfile.name;
    }

    getInterfaceJson(): string {
        return JSON.stringify(this.gridController.getInterface());
    }

}
