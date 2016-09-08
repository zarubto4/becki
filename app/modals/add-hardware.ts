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
import {BackendService} from "../services/BackendService";
import {BeckiFormInput} from "../components/BeckiFormInput";
import {ModalModel} from "../services/ModalService";




export class ModalsAddHardwareModel implements ModalModel {
    constructor(public id:string = "") {
    }
}

@Component({
    selector: "modals-add-hardware",
    templateUrl: "app/modals/add-hardware.html",
    directives: [CORE_DIRECTIVES, REACTIVE_FORM_DIRECTIVES, BeckiFormInput]
})
export class ModalsAddHardwareComponent implements OnInit {

    @Input()
    modalModel:ModalsAddHardwareModel;

    @Output()
    modalClose = new EventEmitter<boolean>();

    form: FormGroup;

    constructor(private backendService:BackendService, private formBuilder:FormBuilder) {

        this.form = this.formBuilder.group({
            "id": ["", [Validators.required]]
        });
    }

    ngOnInit() {
        (<FormControl>(this.form.controls["id"])).setValue(this.modalModel.id);
    }

    onSubmitClick():void {
        this.modalModel.id = this.form.controls["id"].value;
        this.modalClose.emit(true);
    }

    onCloseClick():void {
        this.modalClose.emit(false);
    }

    onCancelClick():void {
        this.modalClose.emit(false);
    }
}
