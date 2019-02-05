/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */


import { Input, Output, EventEmitter, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { TyrionBackendService } from '../services/BackendService';
import { ModalModel } from '../services/ModalService';
import { IHardwareGroup } from '../backend/TyrionAPI';
import { BeckiAsyncValidators } from '../helpers/BeckiAsyncValidators';


export class ModalsHardwareGroupPropertiesModel extends ModalModel {
    constructor(
        public project_id: string = '',
        public group?: IHardwareGroup
    ) {
        super();
    }
}

@Component({
    selector: 'bk-modals-hardware-group-properties',
    templateUrl: './hardware-group-properties.html'
})
export class ModalsHardwareGroupPropertiesComponent implements OnInit {

    @Input()
    modalModel: ModalsHardwareGroupPropertiesModel;

    @Output()
    modalClose = new EventEmitter<boolean>();

    form: FormGroup;

    constructor(private backendService: TyrionBackendService, private formBuilder: FormBuilder) {}

    ngOnInit() {

        this.form = this.formBuilder.group({
            'name': [this.modalModel.group != null ? this.modalModel.group.name : '',
                [
                    Validators.required,
                    Validators.minLength(4)
                ],
                BeckiAsyncValidators.condition(
                    (value) => {
                        return !(this.modalModel && this.modalModel.group && this.modalModel.group.name.length > 3 && this.modalModel.group.name === value);
                    },
                    BeckiAsyncValidators.nameTaken(this.backendService, 'HardwareGroup', this.modalModel.project_id)
                )
            ],
            'description': [this.modalModel.group != null ? this.modalModel.group.description : ''],
            'tags': [this.modalModel.group != null ? this.modalModel.group.tags.slice() : []]
        });

        console.info('Group onInit');
        this.modalModel.group ? console.info(this.modalModel.group.tags) : console.info('There is no Group, so there is no tags ');

    }

    onSubmitClick(): void {
        console.info('Tags before sumbit');
        this.modalModel.group ? console.info(this.modalModel.group.tags) : console.info('There is no tags ');

        if (this.modalModel.group == null) {
            // @ts-ignore
            this.modalModel.group = {};
        }

        this.modalModel.group.name = this.form.controls['name'].value;
        this.modalModel.group.description = this.form.controls['description'].value;
        this.modalModel.group.tags = this.form.controls['tags'].value;
        this.modalClose.emit(true);

        console.info('Tags after submit');
        this.modalModel.group ? console.info(this.modalModel.group.tags) : console.info('There is no tags ');

    }

    onCloseClick(): void {
        this.modalClose.emit(false);
    }

    onCancelClick(): void {
        this.modalClose.emit(false);
    }
}
