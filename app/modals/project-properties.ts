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
import {ApplicableProduct} from "../lib-back-end/index";
import {BeckiFormSelect, BeckiFormSelectOption, beckiFormSelectOptionsMaker} from "../components/BeckiFormSelect";





export class ModalsProjectPropertiesModel implements ModalModel {
    constructor(public products:ApplicableProduct[], public name:string = "", public description:string = "", public product:string = "", public edit:boolean = false, public exceptName:string = null) {
    }
}

@Component({
    selector: "modals-project-properties",
    templateUrl: "app/modals/project-properties.html",
    directives: [CORE_DIRECTIVES, REACTIVE_FORM_DIRECTIVES, BeckiFormInput, BeckiFormSelect]
})
export class ModalsProjectPropertiesComponent implements OnInit {

    @Input()
    modalModel:ModalsProjectPropertiesModel;

    @Output()
    modalClose = new EventEmitter<boolean>();

    options:BeckiFormSelectOption[] = null;

    form: FormGroup;

    constructor(private backEndService:BackEndService, private formBuilder:FormBuilder) {
        console.log(this.form);
        this.form = this.formBuilder.group({
            "name": ["", [Validators.required, Validators.minLength(8)], BeckiAsyncValidators.ifValidator((value) => {
                return !(this.modalModel && this.modalModel.exceptName && this.modalModel.exceptName == value);
            }, BeckiAsyncValidators.projectNameTaken(this.backEndService))],
            "description": ["", [Validators.required, Validators.minLength(24)]],
            "product": ["",[Validators.required]]
        });
        console.log(this.form);
    }

    ngOnInit() {
        this.options = beckiFormSelectOptionsMaker(this.modalModel.products, "product_id", "product_type");
        (<FormControl>(this.form.controls["name"])).setValue(this.modalModel.name);
        (<FormControl>(this.form.controls["description"])).setValue(this.modalModel.description);
        (<FormControl>(this.form.controls["product"])).setValue(this.modalModel.product);
    }

    onSubmitClick():void {
        this.modalModel.name = this.form.controls["name"].value;
        this.modalModel.description = this.form.controls["description"].value;
        this.modalModel.product = this.form.controls["product"].value;
        this.modalClose.emit(true);
    }

    onCloseClick():void {
        this.modalClose.emit(false);
    }

    onCancelClick():void {
        this.modalClose.emit(false);
    }
}
