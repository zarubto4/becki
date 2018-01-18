/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */


import { Input, Output, EventEmitter, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { TyrionBackendService } from '../services/BackendService';
import { ModalModel } from '../services/ModalService';
import { BeckiValidators } from '../helpers/BeckiValidators';


export class ModalsMembersAddModel extends ModalModel {
    constructor(public emails: string[] = []) {
        super();
    }
}

@Component({
    selector: 'bk-modals-members-add',
    templateUrl: './members-add.html'
})
export class ModalsMembersAddComponent implements OnInit {

    @Input()
    modalModel: ModalsMembersAddModel;

    @Output()
    modalClose = new EventEmitter<boolean>();

    formNames: string[] = [];

    form: FormGroup;

    constructor(private formBuilder: FormBuilder) {
        this.form = this.formBuilder.group({});
        // add 1 inputs
        this.onAddClick();
    }

    ngOnInit() {
    }

    valid(): boolean {
        let someNonEmpty = false;
        let valid = true;
        this.formNames.forEach((name) => {
            if (!this.form.controls[name].valid) {
                valid = false;
            }
            if (this.form.controls[name].value) {
                someNonEmpty = true;
            }
        });
        return valid && someNonEmpty;
    }

    onAddClick(): void {
        let name = 'email-' + this.formNames.length;
        this.formNames.push(name);
        this.form.addControl(name, new FormControl('', [
            BeckiValidators.condition(
                () => this.form && this.form.controls[name] && this.form.controls[name].value,
                BeckiValidators.email
            )
        ]));
    }

    onSubmitClick(): void {

        let out: string[] = [];

        this.formNames.forEach((name) => {
            if (this.form.controls[name].value) {
                out.push(this.form.controls[name].value);
            }
        });
        this.modalModel.emails = out;
        this.modalClose.emit(true);
    }

    onCloseClick(): void {
        this.modalClose.emit(false);
    }

    onCancelClick(): void {
        this.modalClose.emit(false);
    }
}
