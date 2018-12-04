import { Component, EventEmitter, Injector, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { BeckiAsyncValidators } from '../helpers/BeckiAsyncValidators';
import { BeckiValidators } from '../helpers/BeckiValidators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslationService } from '../services/TranslationService';
import { TyrionBackendService } from '../services/BackendService';
import { StaticOptionLists } from '../helpers/StaticOptionLists';
import { FormSelectComponentOption } from './FormSelectComponent';

@Component({
    selector: 'bk-contact-form',
    templateUrl: './ContactFormComponent.html'
})
export class ContactFormComponent implements OnInit, OnChanges {

    @Input() allowTypeSelection = true;

    @Input() disabled = false;

    @Output() valid = new EventEmitter<boolean>();

    @Input() contactData: ContactFormData = null;

    @Output() contactDataChange = new EventEmitter<ContactFormData>();

    optionsCountryList: FormSelectComponentOption[] = StaticOptionLists.countryList;

    companyAccount = true;

    inEu: boolean = false;

    formGroup: FormGroup;

    companyAccountSelected($event) {
        this.companyAccount = $event.value;

        // clear the field which are not longer displayed
        if (!this.companyAccount) {
            this.formGroup.controls['company_registration_no'].setValue('');
            this.formGroup.controls['company_vat_number'].setValue('');
            this.formGroup.controls['company_authorized_email'].setValue('');
            this.formGroup.controls['company_authorized_phone'].setValue('');
            this.formGroup.controls['company_web'].setValue('');
        }

        // update the field
        Object.keys(this.formGroup.controls).forEach(controlKey => this.formGroup.controls[controlKey].updateValueAndValidity());
    }

    constructor(private tyrionBackendService: TyrionBackendService, private translationService: TranslationService, private formBuilder: FormBuilder) {
        this.formGroup = this.formBuilder.group({
            'name': ['', [Validators.required, Validators.minLength(4)]],
            'street': ['', [Validators.required]],
            'street_number': ['', [Validators.required]],
            'city': ['', [Validators.required]],
            'zip_code': ['', [Validators.required, Validators.minLength(5)]],
            'country': ['', [Validators.required]],
            'company_registration_no': ['', [BeckiValidators.condition(() => (this.companyAccount && !this.inEu), Validators.required)]],
            'company_vat_number': ['', [
                BeckiValidators.condition(() => (this.companyAccount && this.inEu), Validators.required)
            ],
                [BeckiAsyncValidators.condition(() => (this.companyAccount && this.inEu), BeckiAsyncValidators.validateEntity(this.tyrionBackendService, 'vat_number'))]],
            'company_authorized_email': ['', [BeckiValidators.condition(() => this.companyAccount, Validators.required),
                BeckiValidators.condition(() => (this.companyAccount), BeckiValidators.email)]],
            'company_authorized_phone': ['', [BeckiValidators.condition(() => this.companyAccount, Validators.required), Validators.minLength(5)]],
            'company_web': ['', [BeckiValidators.condition(() => this.companyAccount, Validators.required),
                BeckiValidators.condition(() => (this.companyAccount), BeckiValidators.url)]],
            'invoice_email': ['', [Validators.required, BeckiValidators.email]]
        });
    }

    ngOnInit() {
        // listen for form changed
        this.formGroup.valueChanges.subscribe(val => {
            setTimeout(() => {
                this.contactData = {'company_account': this.companyAccount, ...val};
                this.contactDataChange.emit(this.contactData);
                this.valid.emit(this.formGroup.valid);
            });
        });

        // check if form is valid
        // setTimeout: because of ExpressionChangedAfterItHasBeenCheckedError
        setTimeout(() => {
            this.formGroup.updateValueAndValidity();
            this.valid.emit(this.formGroup.valid);
        });
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['contactData']) {
            let data: ContactFormData = <ContactFormData><any>changes['contactData'];
            if (data !== this.contactData) {
                if (data) {
                    this.contactData = data;
                    this.companyAccount = data.company_account;
                    Object.keys(data)
                        .filter(key => data[key] && this.formGroup.controls[key])
                        .forEach(key => this.formGroup.controls[key].setValue( data[key]));
                } else {
                    Object.keys(this.formGroup.controls)
                        .filter(k => k !== 'country')
                        .forEach(key => this.formGroup.controls[key].setValue(''));
                    this.formGroup.controls['country'].setValue(this.optionsCountryList[0].value);
                }
            }
        }
    }

    countryChanged(): void {
        let country = this.optionsCountryList.find(fCountry => fCountry.value === this.formGroup.controls['country'].value);
        this.inEu = country ? country.data : null;

        // clear the field which are not longer displayed
        if (this.inEu) {
            this.formGroup.controls['company_registration_no'].setValue('');
        } else {
            this.formGroup.controls['company_vat_number'].setValue('');
        }

        // re-validate them
        this.formGroup.controls['company_registration_no'].updateValueAndValidity();
        this.formGroup.controls['company_vat_number'].updateValueAndValidity();
    }
}

export interface ContactFormData {
    company_account: boolean;
    name: string;
    street: string;
    street_number: string;
    city: string;
    zip_code: string;
    country: string;
    company_registration_no?: string;
    company_vat_number?: string;
    company_authorized_email?: string;
    company_authorized_phone?: string;
    company_web?: string;
    invoice_email: string;
}
