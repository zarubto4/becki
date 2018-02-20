/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */

import { Input, Output, EventEmitter, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { TyrionBackendService } from '../services/BackendService';
import { ModalModel } from '../services/ModalService';
import { ITag } from '../backend/TyrionAPI';
import { FormSelectComponentOption } from '../components/FormSelectComponent';


export class ModalsWidgetsWidgetCopyModel extends ModalModel {
    constructor(public name: string = '', public description: string = '',  public tags: ITag[] = [], public type_of_widget: string = '') {
        super();
    }
}

@Component({
    selector: 'bk-modals-widgets-widget-copy',
    templateUrl: './widgets-widget-copy.html'
})
export class ModalsWidgetsWidgetCopyComponent implements OnInit {

    @Input()
    modalModel: ModalsWidgetsWidgetCopyModel;

    @Output()
    modalClose = new EventEmitter<boolean>();

    options: FormSelectComponentOption[] = null;

    form: FormGroup;

    constructor(private backendService: TyrionBackendService, private formBuilder: FormBuilder) {

        this.form = this.formBuilder.group({
            'name': ['', [Validators.required, Validators.minLength(4)]],
            'description': [''],
            'type_of_widget': [''],
        });
    }

    ngOnInit() {
        (<FormControl>(this.form.controls['name'])).setValue(this.modalModel.name);
        (<FormControl>(this.form.controls['description'])).setValue(this.modalModel.description);
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
