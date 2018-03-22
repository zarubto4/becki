/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */


import { Input, Output, EventEmitter, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { TyrionBackendService } from '../services/BackendService';
import { ModalModel } from '../services/ModalService';
import { FormSelectComponentOption, formSelectComponentOptionsMaker } from '../components/FormSelectComponent';

export class ModalsSnapShotInstanceModel extends ModalModel {
    constructor(
        public name: string = '',
        public description: string = '',
        public tags: string[] = [],
        public edit: boolean = false,
    ) {
        super();
    }
}

@Component({
    selector: 'bk-modals-snap-shot-instance',
    templateUrl: './code-properties.html'
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
        let input: { [key: string]: any } = {
            'name': [this.modalModel.name, [Validators.required, Validators.minLength(4), Validators.maxLength(32)]],
            'description': [this.modalModel.description],
            'tags': [this.modalModel.tags]
        };

        this.form = this.formBuilder.group(input);
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
