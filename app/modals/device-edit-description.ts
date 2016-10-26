/**
 * Created by DominikKrisztof on 26.10.16.
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
import {BeckiFormSelect, BeckiFormSelectOption, beckiFormSelectOptionsMaker} from "../components/BeckiFormSelect";
import {ITypeOfBoard, IBoard} from "../backend/TyrionAPI";


export class ModalsDeviceEditDescriptionModel extends ModalModel {
    constructor(public name:string = "", public description:string = "") {
        super();
    }
}

@Component({
    selector: "modals-device-edit-description",
    templateUrl: "app/modals/device-edit-description.html",
    directives: [CORE_DIRECTIVES, REACTIVE_FORM_DIRECTIVES, BeckiFormInput, BeckiFormSelect]
})
export class ModalsDeviceEditDescriptionModelComponent implements OnInit {

    @Input()
    modalModel:ModalsDeviceEditDescriptionModel;

    @Output()
    modalClose = new EventEmitter<boolean>();


    name: string;

    form: FormGroup;

    constructor(private backendService:BackendService, private formBuilder:FormBuilder) {

        this.form = this.formBuilder.group({
            "description": ["", [Validators.required, Validators.minLength(24)]],
        });
    }

    ngOnInit() {
        console.log(this.modalModel);
        (<FormControl>(this.form.controls["description"])).setValue(this.modalModel.description);
        this.name=this.modalModel.name;
    }

    onSubmitClick():void {
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
