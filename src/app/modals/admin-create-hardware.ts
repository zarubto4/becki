/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */


import { Input, Output, EventEmitter, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { TyrionBackendService } from '../services/BackendService';
import { ModalModel } from '../services/ModalService';
import { IHardwareType } from '../backend/TyrionAPI';
import { FormSelectComponentOption } from '../components/FormSelectComponent';


export class ModalsAdminCreateHardwareModel extends ModalModel {
    constructor(
        public hardwareTypes: IHardwareType[],
        public processorId: string = '',
        public hardwareTypeId: string = '',
    ) {
        super();
    }
}

@Component({
    selector: 'bk-modals-admin-create-hardware',
    templateUrl: './admin-create-hardware.html'
})
export class ModalsAdminCreateHardwareComponent implements OnInit {

    @Input()
    modalModel: ModalsAdminCreateHardwareModel;

    @Output()
    modalClose = new EventEmitter<boolean>();

    form: FormGroup;

    hardwareTypeOption: FormSelectComponentOption[] = null;

    constructor(private backendService: TyrionBackendService, private formBuilder: FormBuilder) {
        this.form = this.formBuilder.group({
            'processorId': ['', [Validators.required, Validators.minLength(24), Validators.maxLength(24)]],
            'hardwareTypeId': ['', [Validators.required]]
        });
    }

    ngOnInit() {

        this.hardwareTypeOption = this.modalModel.hardwareTypes.map((pv) => {
            return {
                label: pv.name,
                value: pv.id
            };
        });

        (<FormControl>(this.form.controls['processorId'])).setValue(this.modalModel.processorId);
        (<FormControl>(this.form.controls['hardwareTypeId'])).setValue(this.modalModel.hardwareTypeId);
    }

    onSubmitClick(): void {
        this.modalModel.processorId = this.form.controls['processorId'].value;
        this.modalModel.hardwareTypeId = this.form.controls['hardwareTypeId'].value;
        this.modalClose.emit(true);
    }

    onCloseClick(): void {
        this.modalClose.emit(false);
    }

    onCancelClick(): void {
        this.modalClose.emit(false);
    }
}
