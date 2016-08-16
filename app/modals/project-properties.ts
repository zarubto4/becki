/*
 * © 2015-2016 Becki Authors. See the AUTHORS file found in the top-level
 * directory of this distribution.
 */

import {Input, Output, EventEmitter, Component, OnInit} from "@angular/core";
import {CORE_DIRECTIVES} from "@angular/common";
import {REACTIVE_FORM_DIRECTIVES, FormGroup, FormBuilder, Validators, FormControl} from "@angular/forms";
import {BeckiAsyncValidators} from "../helpers/BeckiAsyncValidators";
import {BackEndService} from "../services/BackEndService";
import {BeckiFormInput} from "../components/BeckiFormInput";
import {ModalModel} from "../services/ModalService";




export class ModalsProjectPropertiesModel implements ModalModel {
    constructor(public name:string = "", public description:string = "", public edit:boolean = false, public exceptName:string = null) {
    }
}

@Component({
    selector: "modals-project-properties",
    templateUrl: "app/modals/project-properties.html",
    directives: [CORE_DIRECTIVES, REACTIVE_FORM_DIRECTIVES, BeckiFormInput]
})
export class ModalsProjectPropertiesComponent implements OnInit {

    @Input()
    modalModel:ModalsProjectPropertiesModel;

    @Output()
    modalClose = new EventEmitter<boolean>();

    form: FormGroup;

    constructor(private backEndService:BackEndService, private formBuilder:FormBuilder) {

        this.form = this.formBuilder.group({
            "name": ["", [Validators.required, Validators.minLength(8)], BeckiAsyncValidators.ifValidator((value) => {
                return !(this.modalModel && this.modalModel.exceptName && this.modalModel.exceptName == value);
            }, BeckiAsyncValidators.projectNameTaken(this.backEndService))],
            "description": ["", [Validators.required, Validators.minLength(24)]]
        });
    }

    ngOnInit() {
        (<FormControl>(this.form.controls["name"])).updateValue(this.modalModel.name);
        (<FormControl>(this.form.controls["description"])).updateValue(this.modalModel.description);
    }

    onSubmitClick():void {
        this.modalModel.name = this.form.controls["name"].value;
        this.modalModel.description = this.form.controls["description"].value;
        this.modalClose.emit(true);
    }

    onCloseClick():void {
        this.modalClose.emit(false);
    }

    onCancelClick():void {
        this.modalClose.emit(false);
    }
}
