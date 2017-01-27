/**
 * Created by DominikKrisztof on 26.10.16.
 */
/*
 * © 2015-2016 Becki Authors. See the AUTHORS file found in the top-level
 * directory of this distribution.
 */
import { Input, Output, EventEmitter, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { BackendService } from '../services/BackendService';
import { ModalModel } from '../services/ModalService';


export class ModalsDeviceEditDescriptionModel extends ModalModel {
    constructor(public id: string = '', public description: string = '') {
        super();
    }
}

@Component({
    selector: 'bk-modals-device-edit-description',
    templateUrl: './device-edit-description.html'
})
export class ModalsDeviceEditDescriptionComponent implements OnInit {

    @Input()
    modalModel: ModalsDeviceEditDescriptionModel;

    @Output()
    modalClose = new EventEmitter<boolean>();

    form: FormGroup;

    constructor(private backendService: BackendService, private formBuilder: FormBuilder) {

        this.form = this.formBuilder.group({
            'description': [''],
        });
    }

    ngOnInit() {
        (<FormControl>(this.form.controls['description'])).setValue(this.modalModel.description);
    }

    onSubmitClick(): void {
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
