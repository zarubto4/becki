/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */


import { Input, Output, EventEmitter, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { TyrionBackendService } from '../services/BackendService';
import { ModalModel } from '../services/ModalService';
import { BeckiValidators } from '../helpers/BeckiValidators';
import { ITariffLabel } from '../backend/TyrionAPI';

export class ModalsTariffModel extends ModalModel {
    constructor(
        public edit: boolean = false,
        public owner_details_required: boolean = false,
        public color: string = '',
        public awesome_icon: string = '',
        public credit_for_beginning: number = 0,
        public description: string = '',
        public name: string = '',
        public identifier: string = '',
        public payment_details_required: boolean = false,
        public labels: ITariffLabel[] = [],
        public labelsInString: string = '[{\"icon":\"fa-fire\",\"description\":\"text\"}]'
    ) {
        super();
    }
}

@Component({
    selector: 'bk-modals-tariff',
    templateUrl: './tariff.html'
})
export class ModalsTariffComponent implements OnInit {

    @Input()
    modalModel: ModalsTariffModel;

    @Output()
    modalClose = new EventEmitter<boolean>();

    form: FormGroup;

    constructor(private backendService: TyrionBackendService, private formBuilder: FormBuilder) {

        this.form = this.formBuilder.group({
            'color': ['', [Validators.required]],
            'awesome_icon': ['', [Validators.required]],
            'credit_for_beginning': ['', [Validators.required]],
            'description': ['', [Validators.required, Validators.minLength(4), Validators.maxLength(30)]],
            'name': ['', [Validators.required, Validators.minLength(4), Validators.maxLength(16)]],
            'identifier': ['', [Validators.required, Validators.minLength(4), Validators.maxLength(16)]],
            'labelsInString': ['', [Validators.required]],
        });
    }

    onBoolean_Owner_details(value: boolean): void {
        this.modalModel.owner_details_required = value;
        // We cannot have payment details without owner details.
        // And set when we allow them, set payment details required to true.
        this.modalModel.payment_details_required = value;
    }

    onBoolean_Payment_details(value: boolean): void {
        this.modalModel.payment_details_required = value;
    }

    ngOnInit() {
        (<FormControl>(this.form.controls['color'])).setValue(this.modalModel.color);
        (<FormControl>(this.form.controls['awesome_icon'])).setValue(this.modalModel.awesome_icon);
        (<FormControl>(this.form.controls['credit_for_beginning'])).setValue(this.modalModel.credit_for_beginning);
        (<FormControl>(this.form.controls['description'])).setValue(this.modalModel.description);
        (<FormControl>(this.form.controls['name'])).setValue(this.modalModel.name);
        (<FormControl>(this.form.controls['identifier'])).setValue(this.modalModel.identifier);

        if (this.modalModel.labels.length > 0) {
            this.modalModel.labelsInString = JSON.stringify(this.modalModel.labels);
        }

        (<FormControl>(this.form.controls['labelsInString'])).setValue(this.modalModel.labelsInString);

    }

    onSubmitClick(): void {
        this.modalModel.color = this.form.controls['color'].value;
        this.modalModel.awesome_icon = this.form.controls['awesome_icon'].value;
        this.modalModel.credit_for_beginning = this.form.controls['credit_for_beginning'].value;
        this.modalModel.description = this.form.controls['description'].value;
        this.modalModel.name = this.form.controls['name'].value;
        this.modalModel.identifier = this.form.controls['identifier'].value;
        this.modalModel.labelsInString = this.form.controls['labelsInString'].value.toString();
        this.modalClose.emit(true);
    }

    onCloseClick(): void {
        this.modalClose.emit(false);
    }

    onCancelClick(): void {
        this.modalClose.emit(false);
    }
}
