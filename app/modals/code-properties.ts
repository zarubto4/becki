/**
 * Created by davidhradek on 17.08.16.
 */

/*
 * © 2015-2016 Becki Authors. See the AUTHORS file found in the top-level
 * directory of this distribution.
 */

import {Input, Output, EventEmitter, Component, OnInit} from "@angular/core";
import {FormGroup, FormBuilder, Validators, FormControl} from "@angular/forms";
import {BackendService} from "../services/BackendService";
import {ModalModel} from "../services/ModalService";
import {BeckiFormSelectOption, beckiFormSelectOptionsMaker} from "../components/BeckiFormSelect";
import {ITypeOfBoard} from "../backend/TyrionAPI";


export class ModalsCodePropertiesModel extends ModalModel {
    constructor(public typeOfBoards: ITypeOfBoard[], public name: string = "", public description: string = "", public deviceType: string = "", public edit: boolean = false, public exceptName: string = null) {
        super();
    }
}

@Component({
    selector: "modals-code-properties",
    templateUrl: "app/modals/code-properties.html"
})
export class ModalsCodePropertiesComponent implements OnInit {

    @Input()
    modalModel: ModalsCodePropertiesModel;

    @Output()
    modalClose = new EventEmitter<boolean>();

    options: BeckiFormSelectOption[] = null;

    form: FormGroup;

    constructor(private backendService: BackendService, private formBuilder: FormBuilder) {
    }

    ngOnInit() {
        this.options = beckiFormSelectOptionsMaker(this.modalModel.typeOfBoards, "id", "name");

        var input:{[key: string]: any;} = {
            "name": [this.modalModel.name, [Validators.required, Validators.minLength(4)]],
            "description": [this.modalModel.description]
        };

        if (this.modalModel.edit == false) {
            input["deviceType"] = [this.modalModel.deviceType, [Validators.required]];
        }

        this.form = this.formBuilder.group(input);
    }

    onSubmitClick(): void {
        this.modalModel.name = this.form.controls["name"].value;
        this.modalModel.description = this.form.controls["description"].value;
        if (this.modalModel.edit == false) {
            this.modalModel.deviceType = this.form.controls["deviceType"].value;
        }
        this.modalClose.emit(true);
    }

    onCloseClick(): void {
        this.modalClose.emit(false);
    }

    onCancelClick(): void {
        this.modalClose.emit(false);
    }
}
