/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */


import { Input, Output, EventEmitter, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { TyrionBackendService } from '../services/BackendService';
import { ModalModel } from '../services/ModalService';


export class ModalsBlocksBlockPropertiesModel extends ModalModel {
    constructor(public name: string = '', public description: string = '', public tags: string[] = [], public edit: boolean = false, public exceptName: string = null) {
        super();
    }
}

@Component({
    selector: 'bk-modals-blocks-block-properties',
    templateUrl: './blocks-block-properties.html'
})
export class ModalsBlocksBlockPropertiesComponent implements OnInit {

    @Input()
    modalModel: ModalsBlocksBlockPropertiesModel;

    @Output()
    modalClose = new EventEmitter<boolean>();

    form: FormGroup;

    constructor(private backendService: TyrionBackendService, private formBuilder: FormBuilder) {
        this.form = this.formBuilder.group({
            'name': ['', [Validators.required, Validators.minLength(4)]],
            'description': ['']
        });
    }

    ngOnInit() {
        (<FormControl>(this.form.controls['name'])).setValue(this.modalModel.name);
        (<FormControl>(this.form.controls['description'])).setValue(this.modalModel.description);
    }

    onSubmitClick(): void {
        this.modalModel.name = this.form.controls['name'].value;
        this.modalModel.description = this.form.controls['description'].value;
        this.modalClose.emit(true);
    }

    onCloseClick(): void {
        this.modalClose.emit(false);
    }

    onCancelClick(): void {
        this.modalClose.emit(false);
    }
}
