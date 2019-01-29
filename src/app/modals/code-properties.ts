/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */


import { Input, Output, EventEmitter, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { TyrionBackendService } from '../services/BackendService';
import { ModalModel } from '../services/ModalService';
import { FormSelectComponentOption, formSelectComponentOptionsMaker } from '../components/FormSelectComponent';
import { ICProgram, IHardwareType, ILibrary } from '../backend/TyrionAPI';
import { BeckiAsyncValidators } from '../helpers/BeckiAsyncValidators';
import { BeckiValidators } from '../helpers/BeckiValidators';

export class ModalsCodePropertiesModel extends ModalModel {
    public hardware_type_id: string = '';
    constructor(
        public hardwareTypes: IHardwareType[],
        public project_id: string,
        public program?: ICProgram,
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

        if (!this.modalModel.program) {
            this.options = formSelectComponentOptionsMaker(this.modalModel.hardwareTypes, 'id', 'name');
        }

        let input: { [key: string]: any } = {
            'name': [this.modalModel.program != null ? this.modalModel.program.name : '',
                [
                    Validators.required,
                    Validators.minLength(4),
                    Validators.maxLength(32)
                ],
                BeckiAsyncValidators.condition(
                    (value) => {
                        return !(this.modalModel && this.modalModel.program && this.modalModel.program.name.length > 3 && this.modalModel.program.name === value);
                    },
                    BeckiAsyncValidators.nameTaken(this.backendService, 'CProgram', this.modalModel.project_id)
                )
            ],
            'description': [this.modalModel.program != null ? this.modalModel.program.description : '', [Validators.maxLength(255)]],
            'tags': [this.modalModel.program != null ? this.modalModel.program.tags : []],
            'hardware_type_id' : ['',  [BeckiValidators.condition(() => ( !this.modalModel.program), Validators.required)]]
        };

        this.form = this.formBuilder.group(input);
    }



    onSubmitClick(): void {


        if (this.modalModel.program == null) {
            // @ts-ignore
            this.modalModel.program = {};
        }

        this.modalModel.program.name = this.form.controls['name'].value;
        this.modalModel.program.description = this.form.controls['description'].value;
        this.modalModel.hardware_type_id = this.form.controls['hardware_type_id'].value;
        this.modalModel.program.tags = this.form.controls['tags'].value;
        this.modalClose.emit(true);
    }

    onCloseClick(): void {
        this.modalClose.emit(false);
    }

    onCancelClick(): void {
        this.modalClose.emit(false);
    }
}
