/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */


import { Input, Output, EventEmitter, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TyrionBackendService } from '../services/BackendService';
import { ModalModel } from '../services/ModalService';
import { IInstanceSnapshot, IShortReference } from '../backend/TyrionAPI';
import { BeckiAsyncValidators } from '../helpers/BeckiAsyncValidators';

export class ModalsSnapShotInstanceModel extends ModalModel {
    constructor(
        public instance_id: string,
        public snapshot?: IShortReference
    ) {
        super();
    }
}

@Component({
    selector: 'bk-modals-snap-shot-instance',
    templateUrl: './snapshot-properties.html'
})
export class ModalsSnapShotInstanceComponent implements OnInit {

    @Input()
    modalModel: ModalsSnapShotInstanceModel;

    @Output()
    modalClose = new EventEmitter<boolean>();

    form: FormGroup;

    constructor(private backendService: TyrionBackendService, private formBuilder: FormBuilder) {
    }

    ngOnInit() {

        console.log("ngOnInit ", this.modalModel.snapshot);

        this.form = this.formBuilder.group({
            'name': [this.modalModel.snapshot != null ? this.modalModel.snapshot.name : '',
                [
                    Validators.required,
                    Validators.minLength(4),
                    Validators.maxLength(32)
                ],
                BeckiAsyncValidators.condition(
                    (value) => {
                        return !(this.modalModel && this.modalModel.snapshot && this.modalModel.snapshot.name.length > 3 && this.modalModel.snapshot.name === value);
                    },
                    BeckiAsyncValidators.nameTaken(this.backendService, 'Snapshot', null, this.modalModel.instance_id)
                )
            ],
            'description': [this.modalModel.snapshot != null ? this.modalModel.snapshot.description : '', [Validators.maxLength(255)]],
            'tags': [this.modalModel.snapshot != null ? this.modalModel.snapshot.tags : []]
        });
    }



    onSubmitClick(): void {
        if (this.modalModel.snapshot == null) {
            // @ts-ignore
            this.modalModel.snapshot = {};
        }

        this.modalModel.snapshot.name = this.form.controls['name'].value;
        this.modalModel.snapshot.description = this.form.controls['description'].value;
        this.modalModel.snapshot.tags = this.form.controls['tags'].value;

        this.modalClose.emit(true);
    }

    onCloseClick(): void {
        this.modalClose.emit(false);
    }

    onCancelClick(): void {
        this.modalClose.emit(false);
    }
}
