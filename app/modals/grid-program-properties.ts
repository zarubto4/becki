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
import {IScreenSizeTypeCombination} from "../backend/TyrionAPI";
import {BeckiFormSelect, beckiFormSelectOptionsMaker, BeckiFormSelectOption} from "../components/BeckiFormSelect";




export class ModalsGridProgramPropertiesModel extends ModalModel {
    constructor(public screenTypes:IScreenSizeTypeCombination, public name:string = "", public description:string = "", public screenTypeId:string = "", public edit:boolean = false, public exceptName:string = null) {
        super();
    }
}

@Component({
    selector: "modals-grid-program-properties",
    templateUrl: "app/modals/grid-program-properties.html",
    directives: [CORE_DIRECTIVES, REACTIVE_FORM_DIRECTIVES, BeckiFormInput, BeckiFormSelect]
})
export class ModalsGridProgramPropertiesComponent implements OnInit {

    @Input()
    modalModel:ModalsGridProgramPropertiesModel;

    @Output()
    modalClose = new EventEmitter<boolean>();

    form: FormGroup;

    options: BeckiFormSelectOption[] = [];

    constructor(private backendService:BackendService, private formBuilder:FormBuilder) {

        this.form = this.formBuilder.group({
            "name": ["", [Validators.required, Validators.minLength(8)]],
            "description": ["", [Validators.required, Validators.minLength(24)]],
            "screenTypeId": ["", [Validators.required]],
        });
    }

    ngOnInit() {

        var optionsPrivate = beckiFormSelectOptionsMaker(this.modalModel.screenTypes.private_types, "id", "name");
        var optionsPublic = beckiFormSelectOptionsMaker(this.modalModel.screenTypes.public_types, "id", "name");

        this.options = optionsPrivate.concat(optionsPublic);

        (<FormControl>(this.form.controls["name"])).setValue(this.modalModel.name);
        (<FormControl>(this.form.controls["description"])).setValue(this.modalModel.description);
        (<FormControl>(this.form.controls["screenTypeId"])).setValue(this.modalModel.screenTypeId);
    }

    onSubmitClick():void {
        this.modalModel.name = this.form.controls["name"].value;
        this.modalModel.description = this.form.controls["description"].value;
        this.modalModel.screenTypeId = this.form.controls["screenTypeId"].value;
        this.modalClose.emit(true);
    }

    onCloseClick():void {
        this.modalClose.emit(false);
    }

    onCancelClick():void {
        this.modalClose.emit(false);
    }
}
