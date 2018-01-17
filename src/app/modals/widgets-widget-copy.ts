/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */

import { Input, Output, EventEmitter, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { BackendService } from '../services/BackendService';
import { ModalModel } from '../services/ModalService';
import { ITypeOfWidgetShortDetail } from '../backend/TyrionAPI';
import { FormSelectComponentOption } from '../components/FormSelectComponent';


export class ModalsWidgetsWidgetCopyModel extends ModalModel {
    constructor(public name: string = '', public description: string = '',  public typeOfWidgets: ITypeOfWidgetShortDetail[] = [], public type_of_widget: string = '') {
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

    constructor(private backendService: BackendService, private formBuilder: FormBuilder) {

        this.form = this.formBuilder.group({
            'name': ['', [Validators.required, Validators.minLength(4)]],
            'description': [''],
            'type_of_widget': [''],
        });
    }

    ngOnInit() {

        this.options = this.modalModel.typeOfWidgets.map((pv) => {
            return {
                label: pv.name,
                value: pv.id
            };
        });

        (<FormControl>(this.form.controls['name'])).setValue(this.modalModel.name);
        (<FormControl>(this.form.controls['description'])).setValue(this.modalModel.description);
        (<FormControl>(this.form.controls['type_of_widget'])).setValue(this.modalModel.type_of_widget);
    }

    onSubmitClick(): void {
        this.modalModel.name = this.form.controls['name'].value;
        this.modalModel.description = this.form.controls['description'].value;
        this.modalModel.type_of_widget = this.form.controls['type_of_widget'].value;
        this.modalClose.emit(true);
    }

    onCloseClick(): void {
        this.modalClose.emit(false);
    }

    onCancelClick(): void {
        this.modalClose.emit(false);
    }
}
