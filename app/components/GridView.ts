/**
 * Created by davidhradek on 14.09.16.
 */
/*
 * © 2015-2016 Becki Authors. See the AUTHORS file found in the top-level
 * directory of this distribution.
 */

import {Core, Widgets, DeviceProfiles, EditorRenderer} from "the-grid";
import {Component, AfterViewInit, OnChanges, Input, ViewChild, ElementRef, SimpleChanges} from "@angular/core";
import {ModalService} from "../services/ModalService";
import {ModalsGridConfigPropertiesModel} from "../modals/grid-config-properties";

@Component({
    selector: "grid-view",
    template: `
    <div #screens></div>
`
})
export class GridView implements AfterViewInit, OnChanges {

    @Input()
    widgets: HTMLElement;

    @ViewChild("screens")
    screens: ElementRef;

    protected gridController: Core.Controller;

    protected gridRenderer: EditorRenderer.ControllerRenderer;

    constructor(protected modalService: ModalService) {

        this.gridController = new Core.Controller();

        this.gridController.registerRequestWidgetSourceCallback((name, resolve) => {
            resolve("widget.addSizeProfiles(1,1,20,20);\n\
            widget.style.padding = 10;\n\
            widget.addConfigProperty(ConfigPropertyType.Integer, 'test','Test value',0);\n\
            var button = new WK.WKButton(widget.context, '\uf0f9'); \n\
            button.style.overflow = WK.WKLabelOverflow.Autosize; \n\
            button.style.x = '50%'; \n\
            button.style.y = '50%'; \n\
            button.style.width = '100%'; \n\
            button.style.height = '100%'; \n\
            button.style.originX = 0.5;\n\
            button.style.originY = 0.5;\n\
            button.style.lineHeight = '100vh';\n\
            button.style.fontFamily = 'FontAwesome';\n\
            widget.add(button); \n\
            \n\
            widget.context.listenEvent('onconfigchanged', function (e) { \n\
                console.log('config changed',widget.getConfigData());\n\
            });\n\
            widget.listenEvent('onresize', function (e) { \n\
                button.style.fontSize = widget.visibleRect.size.height * 0.6; \n\
            });");
        });

        /*this.gridController.registerDataChangedCallback(() => {
         //this.modal.closeModal(false);
            console.log("CHANGED");
         //this.modelChange.emit(this.controller.getDataJson());
         });*/

        this.gridController.registerWidgetService(Widgets.TimeService);
        Core.Controller.cleanWidgetIONameCounter();

    }

    requestCreateWidget(name: string, event?: MouseEvent):EditorRenderer.WidgetDragHandler {
        return (<EditorRenderer.ControllerRenderer>this.gridController.renderer).requestCreateWidget(name, event);
    }

    ngOnChanges(changes: SimpleChanges): void {
    }

    ngAfterViewInit(): void {
        //if (!this.gridController.deviceProfile) {
            //this.gridController.deviceProfile = new DeviceProfiles.iPhone6();
        //}

        this.gridRenderer = new EditorRenderer.ControllerRenderer(this.gridController, this.widgets, this.screens.nativeElement);
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
        //this.gridController.setDataJson(data);
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
