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
        const gridInterface = this.gridController.getInterface();

        let out: any = {
            analogInputs: {},
            digitalInputs: {},
            messageInputs: {},
            analogOutputs: {},
            digitalOutputs: {},
            messageOutputs: {},
        };

        if (gridInterface.analogInputs) {
            for (var k in gridInterface.analogInputs) {
                if (!gridInterface.analogInputs.hasOwnProperty(k)) continue;
                let name = gridInterface.analogInputs[k].externalName;
                if (!out.analogInputs[name]) {
                    out.analogInputs[name] = {};
                }
            }
        }

        if (gridInterface.digitalInputs) {
            for (var k in gridInterface.digitalInputs) {
                if (!gridInterface.digitalInputs.hasOwnProperty(k)) continue;
                let name = gridInterface.digitalInputs[k].externalName;
                if (!out.digitalInputs[name]) {
                    out.digitalInputs[name] = {};
                }
            }
        }

        if (gridInterface.messageInputs) {
            for (var k in gridInterface.messageInputs) {
                if (!gridInterface.messageInputs.hasOwnProperty(k)) continue;
                let name = gridInterface.messageInputs[k].externalName;
                if (!out.messageInputs[name]) {
                    out.messageInputs[name] = {
                        messageTypes: gridInterface.messageInputs[k].messageTypes
                    };
                }
            }
        }

        if (gridInterface.analogOutputs) {
            for (var k in gridInterface.analogOutputs) {
                if (!gridInterface.analogOutputs.hasOwnProperty(k)) continue;
                let name = gridInterface.analogOutputs[k].externalName;
                if (!out.analogOutputs[name]) {
                    out.analogOutputs[name] = {};
                }
            }
        }

        if (gridInterface.digitalOutputs) {
            for (var k in gridInterface.digitalOutputs) {
                if (!gridInterface.digitalOutputs.hasOwnProperty(k)) continue;
                let name = gridInterface.digitalOutputs[k].externalName;
                if (!out.digitalOutputs[name]) {
                    out.digitalOutputs[name] = {};
                }
            }
        }

        if (gridInterface.messageOutputs) {
            for (var k in gridInterface.messageOutputs) {
                if (!gridInterface.messageOutputs.hasOwnProperty(k)) continue;
                let name = gridInterface.messageOutputs[k].externalName;
                if (!out.messageOutputs[name]) {
                    out.messageOutputs[name] = {
                        messageTypes: gridInterface.messageOutputs[k].messageTypes
                    };
                }
            }
        }

        return JSON.stringify(out);
    }

}
