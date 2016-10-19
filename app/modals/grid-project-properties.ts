/**
 * Created by davidhradek on 18.10.16.
 */

/*
 * © 2015-2016 Becki Authors. See the AUTHORS file found in the top-level
 * directory of this distribution.
 */

import {Input, Output, EventEmitter, Component, OnInit} from "@angular/core";
import {CORE_DIRECTIVES} from "@angular/common";
import {REACTIVE_FORM_DIRECTIVES, FormGroup, FormBuilder, Validators, FormControl} from "@angular/forms";
import {BeckiAsyncValidators} from "../helpers/BeckiAsyncValidators";
import {BackendService} from "../services/BackendService";
import {BeckiFormInput} from "../components/BeckiFormInput";
import {ModalModel} from "../services/ModalService";




export class ModalsGridProjectPropertiesModel extends ModalModel {
    constructor(public name:string = "", public description:string = "", public autoIncrementing:boolean = false, public edit:boolean = false, public exceptName:string = null) {
        super();
    }
}

@Component({
    selector: "modals-grid-project-properties",
    templateUrl: "app/modals/grid-project-properties.html",
    directives: [CORE_DIRECTIVES, REACTIVE_FORM_DIRECTIVES, BeckiFormInput]
})
export class ModalsGridProjectPropertiesComponent implements OnInit {

    @Input()
    modalModel:ModalsGridProjectPropertiesModel;

    @Output()
    modalClose = new EventEmitter<boolean>();

    form: FormGroup;

    constructor(private backendService:BackendService, private formBuilder:FormBuilder) {

        this.form = this.formBuilder.group({
            "name": ["", [Validators.required, Validators.minLength(8)]],
            "description": ["", [Validators.required, Validators.minLength(24)]],
            "autoIncrementing": [false]
        });
    }

    ngOnInit() {
        (<FormControl>(this.form.controls["name"])).setValue(this.modalModel.name);
        (<FormControl>(this.form.controls["description"])).setValue(this.modalModel.description);
        (<FormControl>(this.form.controls["autoIncrementing"])).setValue(this.modalModel.autoIncrementing);
    }

    onSubmitClick():void {
        this.modalModel.name = this.form.controls["name"].value;
        this.modalModel.description = this.form.controls["description"].value;
        this.modalModel.autoIncrementing = this.form.controls["autoIncrementing"].value;
        this.modalClose.emit(true);
    }

    onCloseClick():void {
        this.modalClose.emit(false);
    }

    onCancelClick():void {
        this.modalClose.emit(false);
    }
}
