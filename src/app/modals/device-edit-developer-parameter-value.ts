/**
 * Created by DominikKrisztof on 26.10.16.
 */
/*
 * © 2015-2016 Becki Authors. See the AUTHORS file found in the top-level
 * directory of this distribution.
 */
import { Input, Output, EventEmitter, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { TyrionBackendService } from '../services/BackendService';
import { ModalModel } from '../services/ModalService';
import { FormSelectComponentOption } from '../components/FormSelectComponent';


export class ModalsDeviceEditDeveloperParameterValueModel extends ModalModel {
    constructor(public id: string = '',  public valueDescription: string = '', public value: any = '', public values?: FormSelectComponentOption[]) {
        super();
    }
}

@Component({
    selector: 'bk-modals-device-edit-developer-parameter-value',
    templateUrl: './device-edit-developer-parameter-value.html'
})
export class ModalsDeviceEditDeveloperParameterValueComponent implements OnInit {

    @Input()
    modalModel: ModalsDeviceEditDeveloperParameterValueModel;

    @Output()
    modalClose = new EventEmitter<boolean>();

    form: FormGroup;
    options: FormSelectComponentOption[] = null;

    constructor(private backendService: TyrionBackendService, private formBuilder: FormBuilder) {

        this.form = this.formBuilder.group({
            'valueDescription': [''],
            'value': [''],
        });
    }

    ngOnInit() {
        this.options = this.modalModel.values; // If Null then null
        (<FormControl>(this.form.controls['valueDescription'])).setValue(this.modalModel.valueDescription);
        (<FormControl>(this.form.controls['value'])).setValue(this.modalModel.value);
    }

    onSubmitClick(): void {
        this.modalModel.value = this.form.controls['value'].value;
        this.modalClose.emit(true);
    }

    onCloseClick(): void {
        this.modalClose.emit(false);
    }

    onCancelClick(): void {
        this.modalClose.emit(false);
    }
}
