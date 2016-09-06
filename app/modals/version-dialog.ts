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
import {BackEndService} from "../services/BackEndService";
import {BeckiFormInput} from "../components/BeckiFormInput";
import {ModalModel} from "../services/ModalService";

export class ModalsVersionDialogModel implements ModalModel {
    constructor(public name:string = "", public description:string = "", public edit:boolean = false) {
    }
}

@Component({
    selector: "modals-version-dialog",
    templateUrl: "app/modals/version-dialog.html",
    directives: [CORE_DIRECTIVES, REACTIVE_FORM_DIRECTIVES, BeckiFormInput]
})
export class ModalsVersionDialogComponent implements OnInit {

    @Input()
    modalModel:ModalsVersionDialogModel;

    @Output()
    modalClose = new EventEmitter<boolean>();

    form: FormGroup;

    constructor(private formBuilder:FormBuilder) {

        this.form = this.formBuilder.group({
            "name": ["", [Validators.required, Validators.minLength(1)]],
            "description": [""]
        });
    }

    ngOnInit() {
        (<FormControl>(this.form.controls["name"])).setValue(this.modalModel.name);
        (<FormControl>(this.form.controls["description"])).setValue(this.modalModel.description);
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
