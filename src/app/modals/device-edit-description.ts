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
import { IHardware } from '../backend/TyrionAPI';


export class ModalsDeviceEditDescriptionModel extends ModalModel {
    constructor(public id: string = '',  public name: string = '', public description: string = '', public dominant: boolean = false, public can_be_activated: boolean = false) {
        super();
    }
}

@Component({
    selector: 'bk-modals-device-edit-description',
    templateUrl: './device-edit-description.html'
})
export class ModalsDeviceEditDescriptionComponent implements OnInit {

    @Input()
    modalModel: ModalsDeviceEditDescriptionModel;

    @Output()
    modalClose = new EventEmitter<boolean>();

    form: FormGroup;

    constructor(private tyrionBackendService: TyrionBackendService, private formBuilder: FormBuilder) {

        this.form = this.formBuilder.group({
            'name': [''],
            'description': [''],
        });
    }

    ngOnInit() {
        (<FormControl>(this.form.controls['name'])).setValue(this.modalModel.name);
        (<FormControl>(this.form.controls['description'])).setValue(this.modalModel.description);
    }

    onHardwareDeactivate(): void {
        this.tyrionBackendService.projectDeactiveHW(this.modalModel.id)
            .then((values) => {
                this.onSubmitClick();
            })
            .catch((reason) => {
                this.onSubmitClick();
            });
    }

    onHardwareActivate(): void {
        this.tyrionBackendService.projectActiveHW(this.modalModel.id)
            .then((values) => {
                this.onSubmitClick();
            })
            .catch((reason) => {
                this.onSubmitClick();
            });
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
