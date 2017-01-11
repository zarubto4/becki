/**
 * Created by davidhradek on 10.10.16.
 */

/*
 * © 2015-2016 Becki Authors. See the AUTHORS file found in the top-level
 * directory of this distribution.
 */

import {Input, Output, EventEmitter, Component, OnInit} from "@angular/core";
import {FormGroup} from "@angular/forms";
import {ModalModel} from "../services/ModalService";
import {Core} from "the-grid";


export class ModalsGridConfigPropertiesModel extends ModalModel {
    constructor(public widget: Core.Widget) {
        super();
    }
}

@Component({
    selector: "modals-grid-config-properties",
    templateUrl: "app/modals/grid-config-properties.html"
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

    formModel: {[key: string]: any} = {};

    configPropertyType = {
        "Boolean": Core.ConfigPropertyType.Boolean,
        "Float": Core.ConfigPropertyType.Float,
        "Integer": Core.ConfigPropertyType.Integer,
        "String": Core.ConfigPropertyType.String,
        "Color": Core.ConfigPropertyType.Color,
        "FAIcon": Core.ConfigPropertyType.FAIcon,
        "IOName": Core.ConfigPropertyType.IOName,
    };

    constructor() {
    }

    ngOnInit() {

        this.configProperties = this.modalModel.widget.configProperties;

        this.inputs = [];
        this.outputs = [];

        const widgetInterface = this.modalModel.widget.getInterface();
        for(let n in widgetInterface.digitalInputs) {
            this.inputs.push(widgetInterface.digitalInputs[n]);
        }

        for(let n in widgetInterface.analogInputs) {
            this.inputs.push(widgetInterface.analogInputs[n]);
        }

        for(let n in widgetInterface.messageInputs) {
            this.inputs.push(widgetInterface.messageInputs[n]);
        }

        for(let n in widgetInterface.digitalOutputs) {
            this.outputs.push(widgetInterface.digitalOutputs[n]);
        }

        for(let n in widgetInterface.analogOutputs) {
            this.outputs.push(widgetInterface.analogOutputs[n]);
        }

        for(let n in widgetInterface.messageOutputs) {
            this.outputs.push(widgetInterface.messageOutputs[n]);
        }

        console.log(this.inputs, this.outputs);
    
        

        this.configProperties.forEach((cp) => {
            this.formModel[cp.id] = cp.value;
        });

        this.inputs.forEach((input) => {
            this.formModel[input.name] = input.displayName;
        });

        this.outputs.forEach((output) => {
            this.formModel[output.name] = output.displayName;
        });
    }

    onSubmitClick(): void {

        console.log(this.formModel);

        this.configProperties.forEach((configProperty) => {
            if (configProperty.type == Core.ConfigPropertyType.Integer) {
                var num = parseInt(this.formModel[configProperty.id], 10);
                configProperty.value = isNaN(num) ? 0 : num;
            } else if (configProperty.type == Core.ConfigPropertyType.Float) {
                var num = parseFloat(this.formModel[configProperty.id]);
                configProperty.value = isNaN(num) ? 0 : num;
            } else if (configProperty.type == Core.ConfigPropertyType.Boolean) {
                configProperty.value = !!this.formModel[configProperty.id];
            } else {
                configProperty.value = this.formModel[configProperty.id];
            }
        });

        this.inputs.forEach((input) => {
            input.externalName = this.formModel[input.name];
        });

        this.outputs.forEach((output) => {
            output.externalName = this.formModel[output.name];
        });

        this.modalModel.widget.emitOnConfigsChanged();
        this.modalClose.emit(true);
    }

    onCloseClick(): void {
        this.modalClose.emit(false);
    }

    onCancelClick(): void {
        this.modalClose.emit(false);
    }
}
