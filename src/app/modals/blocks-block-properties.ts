/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */


import { Input, Output, EventEmitter, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { TyrionBackendService } from '../services/BackendService';
import { ModalModel } from '../services/ModalService';
import { BeckiAsyncValidators } from '../helpers/BeckiAsyncValidators';
import { IBlock } from '../backend/TyrionAPI';


export class ModalsBlocksBlockPropertiesModel extends ModalModel {
    constructor(public project_id: string, public block?: IBlock) {
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
    }

    ngOnInit() {
        this.form = this.formBuilder.group({
            'name': [this.modalModel.block != null ? this.modalModel.block.name : '',
                [
                    Validators.required,
                    Validators.minLength(4),
                    Validators.maxLength(32)
                ],
                BeckiAsyncValidators.condition(
                    (value) => {
                        return !(this.modalModel && this.modalModel.block && this.modalModel.block.name.length > 3 && this.modalModel.block.name === value);
                    },
                    BeckiAsyncValidators.nameTaken(this.backendService, 'Block', this.modalModel.project_id)
                )
            ],
            'description': [this.modalModel.block != null ? this.modalModel.block.description : '' , [Validators.maxLength(255)]],
            'tags': [this.modalModel.block != null ? this.modalModel.block.tags : []]
        });
    }

    onSubmitClick(): void {


        if (this.modalModel.block == null) {
            // @ts-ignore
            this.modalModel.block = {};
        }

        this.modalModel.block.name = this.form.controls['name'].value;
        this.modalModel.block.description = this.form.controls['description'].value;
        this.modalModel.block.tags = this.form.controls['tags'].value;
        this.modalClose.emit(true);
    }

    onCloseClick(): void {
        this.modalClose.emit(false);
    }

    onCancelClick(): void {
        this.modalClose.emit(false);
    }
}
