/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */


import { Input, Output, EventEmitter, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { TyrionBackendService } from '../services/BackendService';
import { ModalModel } from '../services/ModalService';
import { FormSelectComponentOption, formSelectComponentOptionsMaker } from '../components/FormSelectComponent';
import { IHardwareType } from '../backend/TyrionAPI';

// TODO Rozdělit kopírování a pak Crate a Edit! ( Dva modaly prostě) - Je to upodmínkované jako piča [TZ]
export class ModalsCodePropertiesModel extends ModalModel {
    constructor(
        public hardwareTypes: IHardwareType[],
        public name: string = '',
        public description: string = '',
        public hardware_type_id: string = '',
        public edit: boolean = false,
        public exceptName: string = null,
        public copy: boolean = false,
    ) {
        super();
    }
}

@Component({
    selector: 'bk-modals-code-properties',
    templateUrl: './code-properties.html'
})
export class ModalsCodePropertiesComponent implements OnInit {

    @Input()
    modalModel: ModalsCodePropertiesModel;

    @Output()
    modalClose = new EventEmitter<boolean>();

    options: FormSelectComponentOption[] = null;

    form: FormGroup;

    constructor(private backendService: TyrionBackendService, private formBuilder: FormBuilder) {
    }

    ngOnInit() {
        if (!this.modalModel.edit) {
            this.options = formSelectComponentOptionsMaker(this.modalModel.hardwareTypes, 'id', 'name');
        }
        let input: { [key: string]: any } = {
            'name': [this.modalModel.name, [Validators.required, Validators.minLength(4), Validators.maxLength(32)]],
            'description': [this.modalModel.description]
        };

        if (this.modalModel.edit === false) {
            input['hardware_type_id'] = [this.modalModel.hardware_type_id, [Validators.required]];
        }

        this.form = this.formBuilder.group(input);
    }

    onSubmitClick(): void {
        this.modalModel.name = this.form.controls['name'].value;
        this.modalModel.description = this.form.controls['description'].value;
        if (this.modalModel.edit === false) {
            this.modalModel.hardware_type_id = this.form.controls['hardware_type_id'].value;
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
