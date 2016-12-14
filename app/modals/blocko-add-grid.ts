/**
 * Created by davidhradek on 19.10.16.
 */

import {Input, Output, EventEmitter, Component, OnInit} from "@angular/core";
import {FormGroup, FormBuilder, Validators, FormControl} from "@angular/forms";
import {BackendService} from "../services/BackendService";
import {ModalModel} from "../services/ModalService";
import {BeckiFormSelectOption} from "../components/BeckiFormSelect";
import {IMProject, IMProjectShortDetail} from "../backend/TyrionAPI";


export class ModalsBlockoAddGridModel extends ModalModel {
    constructor(public gridProjects: IMProjectShortDetail[], public selectedGridProject: IMProjectShortDetail = null) {
        super();
    }
}

@Component({
    selector: "modals-blocko-add-grid",
    templateUrl: "app/modals/blocko-add-grid.html"
})
export class ModalsBlockoAddGridComponent implements OnInit {

    @Input()
    modalModel: ModalsBlockoAddGridModel;

    @Output()
    modalClose = new EventEmitter<boolean>();

    options: BeckiFormSelectOption[] = null;

    form: FormGroup;

    constructor(private backendService: BackendService, private formBuilder: FormBuilder) {

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
        (<FormControl>(this.form.controls["grid"])).setValue(this.modalModel.selectedGridProject ? this.modalModel.selectedGridProject : "");
    }

    onSubmitClick(): void {
        this.modalModel.selectedGridProject = this.modalModel.gridProjects.find((g) => (this.form.controls["grid"].value == g.id));
        this.modalClose.emit(true);
    }

    onCloseClick(): void {
        this.modalClose.emit(false);
    }

    onCancelClick(): void {
        this.modalClose.emit(false);
    }
}
