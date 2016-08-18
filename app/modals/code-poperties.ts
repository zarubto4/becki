/**
 * Created by davidhradek on 17.08.16.
 */

/*
 * © 2015-2016 Becki Authors. See the AUTHORS file found in the top-level
 * directory of this distribution.
 */

import {Input, Output, EventEmitter, Component, OnInit} from "@angular/core";
import {CORE_DIRECTIVES} from "@angular/common";
import {REACTIVE_FORM_DIRECTIVES, FormGroup, FormBuilder, Validators, FormControl} from "@angular/forms";
import {BackEndService} from "../services/BackEndService";
import {BeckiFormInput} from "../components/BeckiFormInput";
import {ModalModel} from "../services/ModalService";
import {TypeOfBoard} from "../lib-back-end/index";
import {BeckiFormSelect, BeckiFormSelectOption, beckiFormSelectOptionsMaker} from "../components/BeckiFormSelect";


export class ModalsCodePropertiesModel implements ModalModel {
    constructor(public typeOfBoards:TypeOfBoard[], public name:string = "", public description:string = "", public deviceType:string = "",  public edit:boolean = false, public exceptName:string = null) {
    }
}

@Component({
    selector: "modals-code-properties",
    templateUrl: "app/modals/code-properties.html",
    directives: [CORE_DIRECTIVES, REACTIVE_FORM_DIRECTIVES, BeckiFormInput, BeckiFormSelect]
})
export class ModalsCodePropertiesComponent implements OnInit {

    @Input()
    modalModel:ModalsCodePropertiesModel;

    @Output()
    modalClose = new EventEmitter<boolean>();

    options:BeckiFormSelectOption[] = null;

    form: FormGroup;

    constructor(private backEndService:BackEndService, private formBuilder:FormBuilder) {

        this.form = this.formBuilder.group({ //TODO: async name validation
            "name": ["", [Validators.required, Validators.minLength(8)]],
            "description": ["", [Validators.required, Validators.minLength(24)]],
            "deviceType": ["", [Validators.required]]
        });
    }

    ngOnInit() {
        this.options = beckiFormSelectOptionsMaker(this.modalModel.typeOfBoards, "id", "name");
        (<FormControl>(this.form.controls["name"])).setValue(this.modalModel.name);
        (<FormControl>(this.form.controls["description"])).setValue(this.modalModel.description);
        (<FormControl>(this.form.controls["deviceType"])).setValue(this.modalModel.deviceType);
    }

    onSubmitClick():void {
        this.modalModel.name = this.form.controls["name"].value;
        this.modalModel.description = this.form.controls["description"].value;
        this.modalModel.deviceType = this.form.controls["deviceType"].value;
        this.modalClose.emit(true);
    }

    onCloseClick():void {
        this.modalClose.emit(false);
    }

    onCancelClick():void {
        this.modalClose.emit(false);
    }
}
