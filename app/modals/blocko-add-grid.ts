/**
 * Created by davidhradek on 19.10.16.
 */

import {Input, Output, EventEmitter, Component, OnInit} from "@angular/core";
import {CORE_DIRECTIVES} from "@angular/common";
import {REACTIVE_FORM_DIRECTIVES, FormGroup, FormBuilder, Validators, FormControl} from "@angular/forms";
import {BackendService} from "../services/BackendService";
import {BeckiFormInput} from "../components/BeckiFormInput";
import {ModalModel} from "../services/ModalService";
import {BeckiFormSelect, BeckiFormSelectOption, beckiFormSelectOptionsMaker} from "../components/BeckiFormSelect";
import {ITypeOfBoard, IBoard, IMProject} from "../backend/TyrionAPI";


export class ModalsBlockoAddGridModel extends ModalModel {
    constructor(public gridProjects:IMProject[], public selectedGridProject:IMProject = null) {
        super();
    }
}

@Component({
    selector: "modals-blocko-add-grid",
    templateUrl: "app/modals/blocko-add-grid.html",
    directives: [CORE_DIRECTIVES, REACTIVE_FORM_DIRECTIVES, BeckiFormInput, BeckiFormSelect]
})
export class ModalsBlockoAddGridComponent implements OnInit {

    @Input()
    modalModel:ModalsBlockoAddGridModel;

    @Output()
    modalClose = new EventEmitter<boolean>();

    options:BeckiFormSelectOption[] = null;

    form: FormGroup;

    constructor(private backendService:BackendService, private formBuilder:FormBuilder) {

        this.form = this.formBuilder.group({
            "grid": ["", [Validators.required]]
        });
    }

    ngOnInit() {
        this.options = this.modalModel.gridProjects.map((g) => {
            return {
                value: g.id,
                label: g.name
            };
        });
        (<FormControl>(this.form.controls["grid"])).setValue(this.modalModel.selectedGridProject?this.modalModel.selectedGridProject:"");
    }

    onSubmitClick():void {
        this.modalModel.selectedGridProject = this.modalModel.gridProjects.find((g) => (this.form.controls["grid"].value == g.id));
        this.modalClose.emit(true);
    }

    onCloseClick():void {
        this.modalClose.emit(false);
    }

    onCancelClick():void {
        this.modalClose.emit(false);
    }
}
