/**
 * Created by davidhradek on 19.10.16.
 */

import { Input, Output, EventEmitter, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { BackendService } from '../services/BackendService';
import { ModalModel } from '../services/ModalService';
import { FormSelectComponentOption } from '../components/FormSelectComponent';
import { ISwaggerMProgramShortDetailForBlocko, ISwaggerMProjectShortDetailForBlocko } from '../backend/TyrionAPI';


export class ModalsBlockoAddGridModel extends ModalModel {
    constructor(public gridProjects: ISwaggerMProjectShortDetailForBlocko[], public selectedGridProject: ISwaggerMProjectShortDetailForBlocko = null) {
        super();
    }
}

@Component({
    selector: 'bk-modals-blocko-add-grid',
    templateUrl: './blocko-add-grid.html'
})
export class ModalsBlockoAddGridComponent implements OnInit {

    @Input()
    modalModel: ModalsBlockoAddGridModel;

    @Output()
    modalClose = new EventEmitter<boolean>();

    options: FormSelectComponentOption[] = null;

    form: FormGroup;

    constructor(private backendService: BackendService, private formBuilder: FormBuilder) {

        this.form = this.formBuilder.group({
            'grid': ['', [Validators.required]]
        });
    }

    ngOnInit() {
        this.options = this.modalModel.gridProjects.map((g) => {
            return {
                value: g.id,
                label: g.name
            };
        });
        (<FormControl>(this.form.controls['grid'])).setValue(this.modalModel.selectedGridProject ? this.modalModel.selectedGridProject : '');
    }

    onSubmitClick(): void {
        this.modalModel.selectedGridProject = this.modalModel.gridProjects.find((g) => (this.form.controls['grid'].value === g.id));
        this.modalClose.emit(true);
    }

    onCloseClick(): void {
        this.modalClose.emit(false);
    }

    onCancelClick(): void {
        this.modalClose.emit(false);
    }
}
