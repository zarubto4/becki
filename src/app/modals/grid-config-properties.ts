/**
 * Created by davidhradek on 10.10.16.
 */

/*
 * © 2015-2016 Becki Authors. See the AUTHORS file found in the top-level
 * directory of this distribution.
 */

import { Input, Output, EventEmitter, Component, OnInit, NgZone } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ModalModel } from '../services/ModalService';
import { Core, EditorRenderer, Widgets } from 'the-grid';
import { Types } from 'common-lib';
import { IGridWidgetVersionShortDetail } from '../backend/TyrionAPI';


export class ModalsGridConfigPropertiesModel extends ModalModel {
    constructor(public widget: Core.Widget, public gridController: Core.Controller, public widgetVersions?: IGridWidgetVersionShortDetail[]) {
        super();
    }
}

@Component({
    selector: 'bk-modals-grid-config-properties',
    templateUrl: './grid-config-properties.html'
})
export class ModalsGridConfigPropertiesComponent implements OnInit {

    @Input()
    modalModel: ModalsGridConfigPropertiesModel;

    @Output()
    modalClose = new EventEmitter<boolean>();

    configProperties: Core.ConfigProperty[];
    inputs: Core.Connector[];
    outputs: Core.Connector[];

    form: FormGroup;
    formModelProperties: {[key: string]: any} = {};
    formModelInputs: {[key: string]: any} = {};
    formModelOutputs: {[key: string]: any} = {};
    formModelVersion: string;

    widgetVersions: IGridWidgetVersionShortDetail[] = [];

    StringToConfigPropertyTypeTable = Types.StringToConfigPropertyTypeTable;
    ConfigPropertyType = Types.ConfigPropertyType;

    description: string = null;

    constructor(protected zone: NgZone) {
        this.formModelProperties = {};
        this.formModelInputs = {};
        this.formModelOutputs = {};
        this.formModelVersion = null;
    }

    ngOnInit() {

        this.configProperties = this.modalModel.widget.configProperties;
        this.description = this.modalModel.widget.configPropertiesDescription;

        this.inputs = [];
        this.outputs = [];

        const widgetInterface = this.modalModel.widget.getInterface();
        for (let n in widgetInterface.digitalInputs) {
            if (!widgetInterface.digitalInputs.hasOwnProperty(n)) { continue; }
            this.inputs.push(widgetInterface.digitalInputs[n]);
        }

        for (let n in widgetInterface.analogInputs) {
            if (!widgetInterface.analogInputs.hasOwnProperty(n)) { continue; }
            this.inputs.push(widgetInterface.analogInputs[n]);
        }

        for (let n in widgetInterface.messageInputs) {
            if (!widgetInterface.messageInputs.hasOwnProperty(n)) { continue; }
            this.inputs.push(widgetInterface.messageInputs[n]);
        }

        for (let n in widgetInterface.digitalOutputs) {
            if (!widgetInterface.digitalOutputs.hasOwnProperty(n)) { continue; }
            this.outputs.push(widgetInterface.digitalOutputs[n]);
        }

        for (let n in widgetInterface.analogOutputs) {
            if (!widgetInterface.analogOutputs.hasOwnProperty(n)) { continue; }
            this.outputs.push(widgetInterface.analogOutputs[n]);
        }

        for (let n in widgetInterface.messageOutputs) {
            if (!widgetInterface.messageOutputs.hasOwnProperty(n)) { continue; }
            this.outputs.push(widgetInterface.messageOutputs[n]);
        }


        this.configProperties.forEach((cp) => {
            this.formModelProperties[cp.id] = cp.value;
        });

        this.inputs.forEach((input) => {
            this.formModelInputs[input.name] = input.externalName;
        });

        this.outputs.forEach((output) => {
            this.formModelOutputs[output.name] = output.externalName;
        });

        if (this.modalModel.widget.type) {
            this.formModelVersion = this.modalModel.widget.type.version_id;
        }

        if (this.modalModel.widgetVersions) {
            this.widgetVersions = this.modalModel.widgetVersions;
        }

    }

    protected mergeWidgetInterface(widget: Core.Widget): {[key: string]: Core.Connector} {
        let ret: {[key: string]: Core.Connector} = {};

        this.zone.runOutsideAngular(() => {

            const widgetInterface = widget.getInterface();

            let interfaceArrayNames: string[] = [];
            interfaceArrayNames = interfaceArrayNames.concat(Object.keys(widgetInterface.analogInputs));
            interfaceArrayNames = interfaceArrayNames.concat(Object.keys(widgetInterface.analogOutputs));
            interfaceArrayNames = interfaceArrayNames.concat(Object.keys(widgetInterface.digitalInputs));
            interfaceArrayNames = interfaceArrayNames.concat(Object.keys(widgetInterface.digitalOutputs));
            interfaceArrayNames = interfaceArrayNames.concat(Object.keys(widgetInterface.messageInputs));
            interfaceArrayNames = interfaceArrayNames.concat(Object.keys(widgetInterface.messageOutputs));

            let oldConnectors: {[key: string]: any} = {};
            for (let i = 0; i < interfaceArrayNames.length; i++) {
                let connector: Core.Connector = null;
                if (widgetInterface.analogInputs.hasOwnProperty(interfaceArrayNames[i])) {
                    connector = widgetInterface.analogInputs[interfaceArrayNames[i]];
                } else if (widgetInterface.analogOutputs.hasOwnProperty(interfaceArrayNames[i])) {
                    connector = widgetInterface.analogOutputs[interfaceArrayNames[i]];
                } else if (widgetInterface.digitalInputs.hasOwnProperty(interfaceArrayNames[i])) {
                    connector = widgetInterface.digitalInputs[interfaceArrayNames[i]];
                } else if (widgetInterface.digitalOutputs.hasOwnProperty(interfaceArrayNames[i])) {
                    connector = widgetInterface.digitalOutputs[interfaceArrayNames[i]];
                } else if (widgetInterface.messageInputs.hasOwnProperty(interfaceArrayNames[i])) {
                    connector = widgetInterface.messageInputs[interfaceArrayNames[i]];
                } else if (widgetInterface.messageOutputs.hasOwnProperty(interfaceArrayNames[i])) {
                    connector = widgetInterface.messageOutputs[interfaceArrayNames[i]];
                }

                if (connector) {
                    ret[connector.name] = connector;
                }
            }
        });

        return ret;
    }

    onSubmitClick(): void {
        this.zone.runOutsideAngular(() => {
            this.configProperties.forEach((configProperty) => {
                if (Types.StringToConfigPropertyTypeTable[configProperty.type] === Types.ConfigPropertyType.Integer) {
                    let num = parseInt(this.formModelProperties[configProperty.id], 10);
                    configProperty.value = isNaN(num) ? 0 : num;
                } else if (Types.StringToConfigPropertyTypeTable[configProperty.type] === Types.ConfigPropertyType.Float) {
                    let num = parseFloat(this.formModelProperties[configProperty.id]);
                    configProperty.value = isNaN(num) ? 0 : num;
                } else if (Types.StringToConfigPropertyTypeTable[configProperty.type] === Types.ConfigPropertyType.Boolean) {
                    configProperty.value = !!this.formModelProperties[configProperty.id];
                } else {
                    configProperty.value = this.formModelProperties[configProperty.id];
                }
            });

            this.inputs.forEach((input) => {
                input.externalName = this.formModelInputs[input.name];
            });

            this.outputs.forEach((output) => {
                output.externalName = this.formModelOutputs[output.name];
            });

            this.modalModel.widget.emitOnConfigsChanged();
        });

        this.modalClose.emit(true);

        this.zone.runOutsideAngular(() => {
            //  do the magic ... update widget version :)
            if (this.modalModel.gridController.renderer instanceof EditorRenderer.ControllerRenderer) {
                if (this.modalModel.widget.type && this.modalModel.widget.type.version_id !== this.formModelVersion) {
                    const renderer = <EditorRenderer.ControllerRenderer>(<any>this.modalModel.gridController.renderer);

                    this.modalModel.widget.type.version_id = this.formModelVersion;

                    renderer.requestSourceCode(this.modalModel.widget.type, (src: string, safe: boolean) => {
                        const jsWidget = <Widgets.JSWidget>this.modalModel.widget;

                        //  extract config properties and widget interface
                        const oldInterface = this.mergeWidgetInterface(jsWidget);
                        let oldConnectors: {[key: string]: any} = {};
                        for (let i in oldInterface) {
                            if (oldInterface.hasOwnProperty(i)) {
                                oldConnectors[i] = {
                                    type: oldInterface[i].type,
                                    name: oldInterface[i].name,
                                    externalName: oldInterface[i].externalName
                                };
                            }
                        }

                        let oldProperties: {[key: string]: any} = {};
                        for (let i = 0; i < jsWidget.configProperties.length; i++) {
                            const configProperty = jsWidget.configProperties[i];
                            oldProperties[configProperty.id] = {
                                type: configProperty.type,
                                value: configProperty.value
                            };
                        }


                        const bbb = jsWidget.boxBoundingBox.clone();
                        jsWidget.run(src, safe);
                        jsWidget.setBoxBoundingBox(bbb);

                        //  merge interface and config properties
                        const newInterface = this.mergeWidgetInterface(jsWidget);
                        for (let i in newInterface) {
                            if (newInterface.hasOwnProperty(i)) {
                                if (oldConnectors.hasOwnProperty(i)) {
                                    if (newInterface[i].type === oldConnectors[i].type && newInterface[i].name === oldConnectors[i].name) {
                                        newInterface[i].externalName = oldConnectors[i].externalName;
                                    }
                                }
                            }
                        }

                        for (let i = 0; i < jsWidget.configProperties.length; i++) {
                            const configProperty = jsWidget.configProperties[i];
                            if (oldProperties.hasOwnProperty(configProperty.id)) {
                                if (configProperty.type === oldProperties[configProperty.id].type) {
                                    configProperty.value = oldProperties[configProperty.id].value;
                                }
                            }
                        }
                    });
                }
            }
        });

    }

    onCloseClick(): void {
        this.modalClose.emit(false);
    }

    onCancelClick(): void {
        this.modalClose.emit(false);
    }
}
