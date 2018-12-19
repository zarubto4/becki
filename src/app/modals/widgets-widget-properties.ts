/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */


import { Input, Output, EventEmitter, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { TyrionBackendService } from '../services/BackendService';
import { ModalModel } from '../services/ModalService';
import { BeckiAsyncValidators } from '../helpers/BeckiAsyncValidators';
import { IWidget } from '../backend/TyrionAPI';


export class ModalsWidgetsWidgetPropertiesModel extends ModalModel {
    constructor(public project_id: string, public widget?: IWidget) {
        super();
    }
}

@Component({
    selector: 'bk-modals-widgets-widget-properties',
    templateUrl: './widgets-widget-properties.html'
})
export class ModalsWidgetsWidgetPropertiesComponent implements OnInit {

    @Input()
    modalModel: ModalsWidgetsWidgetPropertiesModel;

    @Output()
    modalClose = new EventEmitter<boolean>();

    form: FormGroup;

    constructor(private backendService: TyrionBackendService, private formBuilder: FormBuilder) {
    }

    ngOnInit() {
        this.form = this.formBuilder.group({
            'name': [this.modalModel.widget != null ? this.modalModel.widget.name : '',
                [
                    Validators.required,
                    Validators.minLength(4),
                    Validators.maxLength(32)
                ],
                BeckiAsyncValidators.condition(
                    (value) => {
                        return !(this.modalModel && this.modalModel.widget && this.modalModel.widget.name.length > 3 && this.modalModel.widget.name === value);
                    },
                    BeckiAsyncValidators.nameTaken(this.backendService, 'Widget',  this.modalModel.project_id)
                )
            ],
            'description': [this.modalModel.widget != null ? this.modalModel.widget.description : '', [Validators.maxLength(255)]],
            'tags': [this.modalModel.widget != null ? this.modalModel.widget.tags.slice() : []],
        });
    }

    onSubmitClick(): void {

        if (this.modalModel.widget == null) {
            // @ts-ignore
            this.modalModel.widget = {};
        }

        this.modalModel.widget.name = this.form.controls['name'].value;
        this.modalModel.widget.description = this.form.controls['description'].value;
        this.modalModel.widget.tags = this.form.controls['tags'].value;
        this.modalClose.emit(true);
    }

    onCloseClick(): void {
        this.modalClose.emit(false);
    }

    onCancelClick(): void {
        this.modalClose.emit(false);
    }
}
