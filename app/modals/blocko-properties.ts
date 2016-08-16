/**
 * Created by davidhradek on 15.08.16.
 */
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
import {ActivatedRouteSnapshot, ActivatedRoute} from "@angular/router";




export class ModalsBlockoPropertiesModel implements ModalModel {
    constructor(public projectId:string, public name:string = "", public description:string = "", public edit:boolean = false, public exceptName:string = null) {
    }
}

@Component({
    selector: "modals-blocko-properties",
    templateUrl: "app/modals/blocko-properties.html",
    directives: [CORE_DIRECTIVES, REACTIVE_FORM_DIRECTIVES, BeckiFormInput]
})
export class ModalsBlockoPropertiesComponent implements OnInit {

    @Input()
    modalModel:ModalsBlockoPropertiesModel;

    @Output()
    modalClose = new EventEmitter<boolean>();

    form: FormGroup;

    constructor(private backEndService:BackEndService, private formBuilder:FormBuilder) {

        this.form = this.formBuilder.group({
            "name": ["", [Validators.required, Validators.minLength(8)], BeckiAsyncValidators.ifValidator((value) => {
                return !(this.modalModel && this.modalModel.exceptName && this.modalModel.exceptName == value);
            }, BeckiAsyncValidators.blockoNameTaken(this.backEndService, () => {
                return this.modalModel.projectId;
            }))],
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
