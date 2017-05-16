/**
 * Created by davidhradek on 14.09.16.
 */
/*
 * © 2015-2016 Becki Authors. See the AUTHORS file found in the top-level
 * directory of this distribution.
 */

import { Core, Widgets, EditorRenderer } from 'the-grid';
import { Component, AfterViewInit, Output, Input, ViewChild, ElementRef, EventEmitter, NgZone, OnDestroy } from '@angular/core';
import { ModalService } from '../services/ModalService';
import { ModalsGridConfigPropertiesModel } from '../modals/grid-config-properties';
import { ITypeOfWidget, IGridWidget, IGridWidgetVersionShortDetail } from '../backend/TyrionAPI';

@Component({
    selector: 'bk-grid-view',
    template: `
    <div #screens></div>
`
})
export class GridViewComponent implements AfterViewInit, OnDestroy {

    @ViewChild('screens')
    screens: ElementRef;

    @Output()
    onRequestWidgetSource = new EventEmitter<{type: any, resolve: (name: string) => void}>();

    @Output()
    onWidgetLog = new EventEmitter<{id: number, type: string, message: string}>();

    @Output()
    onWidgetMessage = new EventEmitter<{id: number, message: any}>();

    @Output()
    onWidgetError = new EventEmitter<{id: number, error: any}>();

    @Input()
    widgetsGroups: ITypeOfWidget[] = null;

    protected gridController: Core.Controller;

    protected gridRenderer: EditorRenderer.ControllerRenderer;

    constructor(protected modalService: ModalService, protected zone: NgZone) {
        this.zone.runOutsideAngular(() => {
            this.gridController = new Core.Controller();

            this.gridController.registerRequestWidgetSourceCallback((type, resolve) => {
                this.onRequestWidgetSource.emit({
                    type: type,
                    resolve: resolve
                });
            });

            /*
            this.gridController.registerDataChangedCallback(() => {
                // this.modal.closeModal(false);
                // console.log("CHANGED");
                // this.modelChange.emit(this.controller.getDataJson());
            });
            */
            Core.Controller.cleanWidgetIONameCounter();
        });
    }

    requestCreateWidget(type: any, event?: MouseEvent): EditorRenderer.WidgetDragHandler {
        let r: EditorRenderer.WidgetDragHandler = null;
        this.zone.runOutsideAngular(() => {
            r = (<EditorRenderer.ControllerRenderer>this.gridController.renderer).requestCreateWidget(type, event);
        });
        return r;
    }

    ngAfterViewInit(): void {
        this.zone.runOutsideAngular(() => {
            this.gridRenderer = new EditorRenderer.ControllerRenderer(this.gridController, this.screens.nativeElement, false, this.handleOnWidgetError, this.handleOnWidgetMessage, this.handleOnWidgetLog);
            this.gridRenderer.registerOpenConfigCallback(widget => {
                let versions: IGridWidgetVersionShortDetail[] = null;

                if (this.widgetsGroups) {
                    for (let i = 0; i < this.widgetsGroups.length; i++) {
                        const group = this.widgetsGroups[i];
                        for (let j = 0; j < group.grid_widgets.length; j++) {
                            const widgetDef: IGridWidget = group.grid_widgets[j];
                            if (widgetDef.id === widget.type.id) {
                                versions = widgetDef.versions;
                            }
                        }
                    }
                }
                this.zone.run(() => {
                    let m = new ModalsGridConfigPropertiesModel(widget, this.gridController, versions);
                    this.modalService.showModal(m);
                });
            });
            this.gridController.setRenderer(this.gridRenderer);
        });
    }

    ngOnDestroy(): void {
        this.zone.runOutsideAngular(() => {
            this.gridController.destroy();
        });
    }

    addPage(): void {
        this.zone.runOutsideAngular(() => {
            this.gridController.addPage();
        });
    }

    handleOnWidgetError = (id: number, error: any) => {
        this.onWidgetError.emit({
            id: id,
            error: error
        });
    }

    handleOnWidgetMessage = (id: number, message: any) => {
        this.onWidgetMessage.emit({
            id: id,
            message: message
        });
    }

    handleOnWidgetLog = (id: number, type: string, message: string) => {
        this.onWidgetLog.emit({
            id: id,
            type: type,
            message: message
        });
    }

    getDataJson(): string {
        let r: string = null;
        this.zone.runOutsideAngular(() => {
            r = this.gridController.getDataJson();
        });
        return r;
    }

    setDataJson(data: string): void {
        this.zone.runOutsideAngular(() => {
            this.gridController.setDataJson(data);
        });
    }

    setDeviceProfile(deviceProfile: string): void {
        this.zone.runOutsideAngular(() => {
            this.gridController.setDeviceProfileByName(deviceProfile);
        });
    }

    getDeviceProfile(): string {
        let r: string = null;
        this.zone.runOutsideAngular(() => {
            r = this.gridController.deviceProfile.name;
        });
        return r;
    }

    getInterfaceJson(): string {

        let out: any = {
            analogInputs: {},
            digitalInputs: {},
            messageInputs: {},
            analogOutputs: {},
            digitalOutputs: {},
            messageOutputs: {},
        };

        this.zone.runOutsideAngular(() => {
            const gridInterface = this.gridController.getInterface();

            if (gridInterface.analogInputs) {
                for (let k in gridInterface.analogInputs) {
                    if (!gridInterface.analogInputs.hasOwnProperty(k)) { continue; }
                    let name = gridInterface.analogInputs[k].externalName;
                    if (!out.analogInputs[name]) {
                        out.analogInputs[name] = {};
                    }
                }
            }

            if (gridInterface.digitalInputs) {
                for (let k in gridInterface.digitalInputs) {
                    if (!gridInterface.digitalInputs.hasOwnProperty(k)) { continue; }
                    let name = gridInterface.digitalInputs[k].externalName;
                    if (!out.digitalInputs[name]) {
                        out.digitalInputs[name] = {};
                    }
                }
            }

            if (gridInterface.messageInputs) {
                for (let k in gridInterface.messageInputs) {
                    if (!gridInterface.messageInputs.hasOwnProperty(k)) { continue; }
                    let name = gridInterface.messageInputs[k].externalName;
                    if (!out.messageInputs[name]) {
                        out.messageInputs[name] = {
                            messageTypes: gridInterface.messageInputs[k].messageTypes
                        };
                    }
                }
            }

            if (gridInterface.analogOutputs) {
                for (let k in gridInterface.analogOutputs) {
                    if (!gridInterface.analogOutputs.hasOwnProperty(k)) { continue; }
                    let name = gridInterface.analogOutputs[k].externalName;
                    if (!out.analogOutputs[name]) {
                        out.analogOutputs[name] = {};
                    }
                }
            }

            if (gridInterface.digitalOutputs) {
                for (let k in gridInterface.digitalOutputs) {
                    if (!gridInterface.digitalOutputs.hasOwnProperty(k)) { continue; }
                    let name = gridInterface.digitalOutputs[k].externalName;
                    if (!out.digitalOutputs[name]) {
                        out.digitalOutputs[name] = {};
                    }
                }
            }

            if (gridInterface.messageOutputs) {
                for (let k in gridInterface.messageOutputs) {
                    if (!gridInterface.messageOutputs.hasOwnProperty(k)) { continue; }
                    let name = gridInterface.messageOutputs[k].externalName;
                    if (!out.messageOutputs[name]) {
                        out.messageOutputs[name] = {
                            messageTypes: gridInterface.messageOutputs[k].messageTypes
                        };
                    }
                }
            }
        });

        return JSON.stringify(out);
    }

}
