/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */


import { Input, Output, EventEmitter, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { TyrionBackendService } from '../services/BackendService';
import { ModalModel } from '../services/ModalService';
import { IProductExtensionType } from '../backend/TyrionAPI';
import { FormSelectComponentOption } from '../components/FormSelectComponent';

export class ModalsExtensionModel extends ModalModel {
    constructor(
        public extensionTypes: IProductExtensionType[] = [],
        public edit: boolean = false,
        public color: string = '',
        public name: string = '',
        public description: string = '',
        public extension_type: string = '',
        public config: string = '{}'
    ) {
        super();
    }
}

@Component({
    selector: 'bk-modals-extension',
    templateUrl: './extension.html'
})
export class ModalsExtensionComponent implements OnInit {

    @Input()
    modalModel: ModalsExtensionModel;

    @Output()
    modalClose = new EventEmitter<boolean>();

    extensionTypeOptions: FormSelectComponentOption[] = null;

    form: FormGroup;

    constructor(private backendService: TyrionBackendService, private formBuilder: FormBuilder) {

        this.form = this.formBuilder.group({
            'color': ['', [Validators.required]],
            'name': ['', [Validators.required, Validators.minLength(4), Validators.maxLength(60)]],
            'description': ['', [Validators.maxLength(255)]],
            'extension_type': ['', [ ]],
            'config': ['', [Validators.required]],
        });
    }

    ngOnInit() {

        this.extensionTypeOptions = this.modalModel.extensionTypes.map((pv) => {
            return {
                label: pv.name + ' (' + pv.description  + ')',
                value: pv.type
            };
        });

        (<FormControl>(this.form.controls['color'])).setValue(this.modalModel.color);
        (<FormControl>(this.form.controls['name'])).setValue(this.modalModel.name);
        (<FormControl>(this.form.controls['description'])).setValue(this.modalModel.description);
        (<FormControl>(this.form.controls['extension_type'])).setValue(this.modalModel.extension_type);
        (<FormControl>(this.form.controls['config'])).setValue(this.modalModel.config);
    }

    onSubmitClick(): void {
        this.modalModel.color = this.form.controls['color'].value;
        this.modalModel.name = this.form.controls['name'].value;
        this.modalModel.description = this.form.controls['description'].value;
        this.modalModel.extension_type = this.form.controls['extension_type'].value;

        this.modalModel.config = this.form.controls['config'].value;
        this.modalClose.emit(true);
    }

    onCloseClick(): void {
        this.modalClose.emit(false);
    }

    onCancelClick(): void {
        this.modalClose.emit(false);
    }
}
