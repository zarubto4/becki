/**
 * Created by davidhradek on 15.09.16.
 */

/*
 * © 2015-2016 Becki Authors. See the AUTHORS file found in the top-level
 * directory of this distribution.
 */

import {Input, Output, EventEmitter, Component, OnInit} from "@angular/core";
import {CORE_DIRECTIVES} from "@angular/common";
import {
    REACTIVE_FORM_DIRECTIVES, FormGroup, FormBuilder, Validators, FormControl,
    FORM_DIRECTIVES
} from "@angular/forms";
import {BackendService} from "../services/BackendService";
import {BeckiFormInput} from "../components/BeckiFormInput";
import {ModalModel} from "../services/ModalService";
import {Core} from "blocko";


export class ModalsBlockoConfigPropertiesModel extends ModalModel {
    constructor(public block:Core.Block) {
        super();
    }
}

@Component({
    selector: "modals-blocko-config-properties",
    templateUrl: "app/modals/blocko-config-properties.html",
    directives: [CORE_DIRECTIVES, FORM_DIRECTIVES, BeckiFormInput]
})
export class ModalsBlockoConfigPropertiesComponent implements OnInit {

    @Input()
    modalModel:ModalsBlockoConfigPropertiesModel;

    @Output()
    modalClose = new EventEmitter<boolean>();

    configProperties:Core.ConfigProperty[];

    form:FormGroup;

    formModel:{[key: string]: any} = {};

    configPropertyType = {
        "Boolean": Core.ConfigPropertyType.Boolean,
        "Float": Core.ConfigPropertyType.Float,
        "Integer": Core.ConfigPropertyType.Integer,
        "String": Core.ConfigPropertyType.String,
    };

    constructor() {

    }

    ngOnInit() {

        this.configProperties = this.modalModel.block.getConfigProperties();

        this.configProperties.forEach((cp) => {
            this.formModel[cp.name] = cp.value;
        });
    }

    onSubmitClick():void {

        this.configProperties.forEach((configProperty) => {

            if (configProperty.type == Core.ConfigPropertyType.Integer) {
                var num = parseInt(this.formModel[configProperty.name], 10);
                configProperty.value = isNaN(num)?0:num;
            }
            if (configProperty.type == Core.ConfigPropertyType.Float) {
                var num = parseFloat(this.formModel[configProperty.name]);
                configProperty.value = isNaN(num)?0:num;
            }
            if (configProperty.type == Core.ConfigPropertyType.String) {
                configProperty.value = this.formModel[configProperty.name];
            }
            if (configProperty.type == Core.ConfigPropertyType.Boolean) {
                configProperty.value = !!this.formModel[configProperty.name];
            }

        });

        this.modalModel.block.emitConfigChanged();
        this.modalClose.emit(true);
    }

    onCloseClick():void {
        this.modalClose.emit(false);
    }

    onCancelClick():void {
        this.modalClose.emit(false);
    }
}
