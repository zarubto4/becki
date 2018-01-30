/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */

import { Input, Output, EventEmitter, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { IProducer, ITypeOfBoard } from '../backend/TyrionAPI';
import { BeckiAsyncValidators } from '../helpers/BeckiAsyncValidators';
import { TyrionBackendService } from '../services/BackendService';
import { FormSelectComponentOption } from '../components/FormSelectComponent';
import { ModalModel } from '../services/ModalService';
import { BeckiValidators } from '../helpers/BeckiValidators';
import { StaticOptionLists } from '../helpers/StaticOptionLists';

export class ModalsCompanyInformationModel extends ModalModel {
    constructor(
        public edit: boolean = false,
        public city: string = '',
        public company_authorized_email: string = '',
        public company_authorized_phone: string = '',
        public company_name: string = '',
        public company_web: string = '',
        public country: string = '',
        public invoice_email: string = '',
        public street: string = '',
        public street_number: string = '',
        public company_registration_no: string = '',
        public company_vat_number: string = '',
        public zip_code: string = '',
    ) {
        super();
    }
}

@Component({
    selector: 'bk-modals-company-information',
    templateUrl: './company-information.html'
})
export class ModalsCompanyInformationComponent implements OnInit {

    @Input()
    modalModel: ModalsCompanyInformationModel;

    @Output()
    modalClose = new EventEmitter<boolean>();

    producer_options: FormSelectComponentOption[] = null;
    typeOfBoard_options: FormSelectComponentOption[] = null;

    form: FormGroup;

    optionsCountryList: FormSelectComponentOption[] = StaticOptionLists.countryList;

    inEu: boolean = false;

    constructor(private backendService: TyrionBackendService, private formBuilder: FormBuilder) {

        this.form = this.formBuilder.group({
            'city': ['', [Validators.required]],
            'company_authorized_email': ['', [Validators.required, BeckiValidators.email]],
            'company_authorized_phone': ['', [Validators.required, Validators.minLength(5)]],
            'company_name': ['', [Validators.required, Validators.minLength(5)]],
            'company_web': ['', [Validators.required, BeckiValidators.url]],
            'country': ['', [Validators.required]],
            'invoice_email': ['', [Validators.required, BeckiValidators.email]],
            'street': ['', [Validators.required]],
            'street_number': ['', [Validators.required]],
            'company_registration_no' : ['', [BeckiValidators.condition(() => !this.inEu, Validators.required)]],
            'company_vat_number' : ['', [BeckiValidators.condition(() => this.inEu, Validators.required)], BeckiAsyncValidators.condition(() => this.inEu, BeckiAsyncValidators.validateEntity(this.backendService, 'vat_number'))],
            'zip_code': ['', [Validators.required]]
        });
    }

    checkInEu(): void {

        let country = this.optionsCountryList.find(fCountry => this.form && fCountry.value === this.form.controls['country'].value);
        this.inEu = country ? country.data : null;

        (<FormControl>(this.form.controls['company_registration_no'])).setValue('');
        (<FormControl>(this.form.controls['company_vat_number'])).setValue('');

        this.form.controls['company_registration_no'].updateValueAndValidity();
        this.form.controls['company_vat_number'].updateValueAndValidity();

    }

    ngOnInit() {
        (<FormControl>(this.form.controls['city'])).setValue(this.modalModel.city);
        (<FormControl>(this.form.controls['company_authorized_email'])).setValue(this.modalModel.company_authorized_email);
        (<FormControl>(this.form.controls['company_authorized_phone'])).setValue(this.modalModel.company_authorized_phone);
        (<FormControl>(this.form.controls['company_name'])).setValue(this.modalModel.company_name);
        (<FormControl>(this.form.controls['company_web'])).setValue(this.modalModel.company_web);
        (<FormControl>(this.form.controls['country'])).setValue(this.modalModel.country);
        (<FormControl>(this.form.controls['invoice_email'])).setValue(this.modalModel.invoice_email);
        (<FormControl>(this.form.controls['street'])).setValue(this.modalModel.street);
        (<FormControl>(this.form.controls['street_number'])).setValue(this.modalModel.street_number);
        (<FormControl>(this.form.controls['company_registration_no'])).setValue(this.modalModel.company_registration_no);
        (<FormControl>(this.form.controls['company_vat_number'])).setValue(this.modalModel.company_vat_number);
        (<FormControl>(this.form.controls['zip_code'])).setValue(this.modalModel.zip_code);
    }

    onSubmitClick(): void {
        this.modalModel.city = this.form.controls['city'].value;
        this.modalModel.company_authorized_email = this.form.controls['company_authorized_email'].value;
        this.modalModel.company_authorized_phone = this.form.controls['company_authorized_phone'].value;
        this.modalModel.company_name = this.form.controls['company_name'].value;
        this.modalModel.company_web = this.form.controls['company_web'].value;
        this.modalModel.country = this.form.controls['country'].value;
        this.modalModel.invoice_email = this.form.controls['invoice_email'].value;
        this.modalModel.street = this.form.controls['street'].value;
        this.modalModel.street_number = this.form.controls['street_number'].value;
        this.modalModel.company_registration_no = this.form.controls['company_registration_no'].value;
        this.modalModel.company_vat_number = this.form.controls['company_vat_number'].value;
        this.modalModel.zip_code = this.form.controls['zip_code'].value;
        this.modalClose.emit(true);
    }

    onCloseClick(): void {
        this.modalClose.emit(false);
    }

    onCancelClick(): void {
        this.modalClose.emit(false);
    }
}
