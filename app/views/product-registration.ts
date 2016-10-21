/**
 * Created by dominik krisztof on 22/09/16.
 */

import {Component, Injector, OnInit} from '@angular/core';
import {LayoutMain} from "../layouts/main";
import {BaseMainComponent} from "./BaseMainComponent";
import {IGeneralTariff, IAdditionalPackage} from "../backend/TyrionAPI";
import {FlashMessageSuccess, FlashMessageWarning, FlashMessageError} from "../services/FlashMessagesService";
import {FormGroup, Validators, REACTIVE_FORM_DIRECTIVES} from "@angular/forms";
import {BeckiValidators} from "../helpers/BeckiValidators";
import {BeckiFormSelectOption} from "../components/BeckiFormSelect";
import {Subscription} from "rxjs";

@Component({
    selector: "product-registration",
    directives: [LayoutMain, REACTIVE_FORM_DIRECTIVES],
    templateUrl: "app/views/product-registration.html"
})
export class ProductRegistrationComponent extends BaseMainComponent implements OnInit {

    form: FormGroup;

    routeParamsSubscription: Subscription;

    tariffForRegistration: IGeneralTariff[];

    packageForRegistration: IAdditionalPackage[];

    serverResponse: any;

    step: number;

    isCompany: boolean = false;

    paymentNeed: boolean = false;

    activeClass: {[key: string]: boolean} = {};

    toggleIsCompany() {
        this.isCompany = !this.isCompany;
        Object.keys(this.form.controls).forEach((key)=> {
            this.form.controls[key].updateValueAndValidity();
        });
    }

    country_list: BeckiFormSelectOption[] = [
        {
            label: "Afghanistan ",
            value: "Afghanistan "
        },
        {
            label: "Albania",
            value: "Albania"
        },
        {
            label: "Algeria",
            value: "Algeria"
        },
        {
            label: "Andorra",
            value: "Andorra"
        },
        {
            label: "Angola ",
            value: "Angola "
        },
        {
            label: "Antigua and Barbuda ",
            value: "Antigua and Barbuda "
        },
        {
            label: "Argentina ",
            value: "Argentina "
        },
        {
            label: "Armenia",
            value: "Armenia"
        },
        {
            label: "Australia ",
            value: "Australia "
        },
        {
            label: "Austria",
            value: "Austria"
        },
        {
            label: "Azerbaijan",
            value: "Azerbaijan"
        },
        {
            label: "Bahamas",
            value: "Bahamas"
        },
        {
            label: "Bahrain",
            value: "Bahrain"
        },
        {
            label: "Bangladesh",
            value: "Bangladesh"
        },
        {
            label: "Barbados",
            value: "Barbados"
        },
        {
            label: "Belarus",
            value: "Belarus"
        },
        {
            label: "Belgium",
            value: "Belgium"
        },
        {
            label: "Belize ",
            value: "Belize "
        },
        {
            label: "Benin",
            value: "Benin"
        },
        {
            label: "Bhutan ",
            value: "Bhutan "
        },
        {
            label: "Bolivia",
            value: "Bolivia"
        },
        {
            label: "Bosnia and Herzegovina",
            value: "Bosnia and Herzegovina"
        },
        {
            label: "Botswana",
            value: "Botswana"
        },
        {
            label: "Brazil ",
            value: "Brazil "
        },
        {
            label: "Brunei ",
            value: "Brunei "
        },
        {
            label: "Bulgaria",
            value: "Bulgaria"
        },
        {
            label: "Burkina Faso",
            value: "Burkina Faso"
        },
        {
            label: "Burundi",
            value: "Burundi"
        },
        {
            label: "Cabo Verde",
            value: "Cabo Verde"
        },
        {
            label: "Cambodia",
            value: "Cambodia"
        },
        {
            label: "Cameroon",
            value: "Cameroon"
        },
        {
            label: "Canada ",
            value: "Canada "
        },
        {
            label: "Central African Republic (CAR) ",
            value: "Central African Republic (CAR) "
        },
        {
            label: "Chad ",
            value: "Chad "
        },
        {
            label: "Chile",
            value: "Chile"
        },
        {
            label: "China",
            value: "China"
        },
        {
            label: "Colombia",
            value: "Colombia"
        },
        {
            label: "Comoros",
            value: "Comoros"
        },
        {
            label: "Democratic Republic of the Congo ",
            value: "Democratic Republic of the Congo "
        },
        {
            label: "Republic of the Congo ",
            value: "Republic of the Congo "
        },
        {
            label: "Costa Rica",
            value: "Costa Rica"
        },
        {
            label: "Cote d'Ivoire ",
            value: "Cote d'Ivoire "
        },
        {
            label: "Croatia",
            value: "Croatia"
        },
        {
            label: "Cuba ",
            value: "Cuba "
        },
        {
            label: "Cyprus ",
            value: "Cyprus "
        },
        {
            label: "Czech Republic",
            value: "Czech Republic"
        },
        {
            label: "Denmark",
            value: "Denmark"
        },
        {
            label: "Djibouti",
            value: "Djibouti"
        },
        {
            label: "Dominica",
            value: "Dominica"
        },
        {
            label: "Dominican Republic",
            value: "Dominican Republic"
        },
        {
            label: "Ecuador",
            value: "Ecuador"
        },
        {
            label: "Egypt",
            value: "Egypt"
        },
        {
            label: "El Salvador ",
            value: "El Salvador "
        },
        {
            label: "Equatorial Guinea ",
            value: "Equatorial Guinea "
        },
        {
            label: "Eritrea",
            value: "Eritrea"
        },
        {
            label: "Estonia",
            value: "Estonia"
        },
        {
            label: "Ethiopia",
            value: "Ethiopia"
        },
        {
            label: "Fiji ",
            value: "Fiji "
        },
        {
            label: "Finland",
            value: "Finland"
        },
        {
            label: "France ",
            value: "France "
        },
        {
            label: "Gabon",
            value: "Gabon"
        },
        {
            label: "Gambia ",
            value: "Gambia "
        },
        {
            label: "Georgia",
            value: "Georgia"
        },
        {
            label: "Germany",
            value: "Germany"
        },
        {
            label: "Ghana",
            value: "Ghana"
        },
        {
            label: "Greece ",
            value: "Greece "
        },
        {
            label: "Grenada",
            value: "Grenada"
        },
        {
            label: "Guatemala ",
            value: "Guatemala "
        },
        {
            label: "Guinea ",
            value: "Guinea "
        },
        {
            label: "Guinea-Bissau ",
            value: "Guinea-Bissau "
        },
        {
            label: "Guyana ",
            value: "Guyana "
        },
        {
            label: "Haiti",
            value: "Haiti"
        },
        {
            label: "Honduras",
            value: "Honduras"
        },
        {
            label: "Hungary",
            value: "Hungary"
        },
        {
            label: "Iceland",
            value: "Iceland"
        },
        {
            label: "India",
            value: "India"
        },
        {
            label: "Indonesia ",
            value: "Indonesia "
        },
        {
            label: "Iran ",
            value: "Iran "
        },
        {
            label: "Iraq ",
            value: "Iraq "
        },
        {
            label: "Ireland",
            value: "Ireland"
        },
        {
            label: "Israel ",
            value: "Israel "
        },
        {
            label: "Italy",
            value: "Italy"
        },
        {
            label: "Jamaica",
            value: "Jamaica"
        },
        {
            label: "Japan",
            value: "Japan"
        },
        {
            label: "Jordan ",
            value: "Jordan "
        },
        {
            label: "Kazakhstan",
            value: "Kazakhstan"
        },
        {
            label: "Kenya",
            value: "Kenya"
        },
        {
            label: "Kiribati",
            value: "Kiribati"
        },
        {
            label: "Kosovo ",
            value: "Kosovo "
        },
        {
            label: "Kuwait ",
            value: "Kuwait "
        },
        {
            label: "Kyrgyzstan",
            value: "Kyrgyzstan"
        },
        {
            label: "Laos ",
            value: "Laos "
        },
        {
            label: "Latvia ",
            value: "Latvia "
        },
        {
            label: "Lebanon",
            value: "Lebanon"
        },
        {
            label: "Lesotho",
            value: "Lesotho"
        },
        {
            label: "Liberia",
            value: "Liberia"
        },
        {
            label: "Libya",
            value: "Libya"
        },
        {
            label: "Liechtenstein ",
            value: "Liechtenstein "
        },
        {
            label: "Lithuania ",
            value: "Lithuania "
        },
        {
            label: "Luxembourg",
            value: "Luxembourg"
        },
        {
            label: "Macedonia ",
            value: "Macedonia "
        },
        {
            label: "Madagascar",
            value: "Madagascar"
        },
        {
            label: "Malawi ",
            value: "Malawi "
        },
        {
            label: "Malaysia",
            value: "Malaysia"
        },
        {
            label: "Maldives",
            value: "Maldives"
        },
        {
            label: "Mali ",
            value: "Mali "
        },
        {
            label: "Malta",
            value: "Malta"
        },
        {
            label: "Marshall Islands",
            value: "Marshall Islands"
        },
        {
            label: "Mauritania",
            value: "Mauritania"
        },
        {
            label: "Mauritius ",
            value: "Mauritius "
        },
        {
            label: "Mexico ",
            value: "Mexico "
        },
        {
            label: "Micronesia",
            value: "Micronesia"
        },
        {
            label: "Moldova",
            value: "Moldova"
        },
        {
            label: "Monaco ",
            value: "Monaco "
        },
        {
            label: "Mongolia",
            value: "Mongolia"
        },
        {
            label: "Montenegro",
            value: "Montenegro"
        },
        {
            label: "Morocco",
            value: "Morocco"
        },
        {
            label: "Mozambique",
            value: "Mozambique"
        },
        {
            label: "Myanmar (Burma) ",
            value: "Myanmar (Burma) "
        },
        {
            label: "Namibia",
            value: "Namibia"
        },
        {
            label: "Nauru",
            value: "Nauru"
        },
        {
            label: "Nepal",
            value: "Nepal"
        },
        {
            label: "Netherlands ",
            value: "Netherlands "
        },
        {
            label: "New Zealand ",
            value: "New Zealand "
        },
        {
            label: "Nicaragua ",
            value: "Nicaragua "
        },
        {
            label: "Niger",
            value: "Niger"
        },
        {
            label: "Nigeria",
            value: "Nigeria"
        },
        {
            label: "North Korea ",
            value: "North Korea "
        },
        {
            label: "Norway ",
            value: "Norway "
        },
        {
            label: "Oman ",
            value: "Oman "
        },
        {
            label: "Pakistan",
            value: "Pakistan"
        },
        {
            label: "Palau",
            value: "Palau"
        },
        {
            label: "Palestine ",
            value: "Palestine "
        },
        {
            label: "Panama ",
            value: "Panama "
        },
        {
            label: "Papua New Guinea",
            value: "Papua New Guinea"
        },
        {
            label: "Paraguay",
            value: "Paraguay"
        },
        {
            label: "Peru ",
            value: "Peru "
        },
        {
            label: "Philippines ",
            value: "Philippines "
        },
        {
            label: "Poland ",
            value: "Poland "
        },
        {
            label: "Portugal",
            value: "Portugal"
        },
        {
            label: "Qatar",
            value: "Qatar"
        },
        {
            label: "Romania",
            value: "Romania"
        },
        {
            label: "Russia ",
            value: "Russia "
        },
        {
            label: "Rwanda ",
            value: "Rwanda "
        },
        {
            label: "Saint Kitts and Nevis ",
            value: "Saint Kitts and Nevis "
        },
        {
            label: "Saint Lucia ",
            value: "Saint Lucia "
        },
        {
            label: "Saint Vincent and the Grenadines ",
            value: "Saint Vincent and the Grenadines "
        },
        {
            label: "Samoa",
            value: "Samoa"
        },
        {
            label: "San Marino",
            value: "San Marino"
        },
        {
            label: "Sao Tome and Principe ",
            value: "Sao Tome and Principe "
        },
        {
            label: "Saudi Arabia",
            value: "Saudi Arabia"
        },
        {
            label: "Senegal",
            value: "Senegal"
        },
        {
            label: "Serbia ",
            value: "Serbia "
        },
        {
            label: "Seychelles",
            value: "Seychelles"
        },
        {
            label: "Sierra Leone",
            value: "Sierra Leone"
        },
        {
            label: "Singapore ",
            value: "Singapore "
        },
        {
            label: "Slovakia",
            value: "Slovakia"
        },
        {
            label: "Slovenia",
            value: "Slovenia"
        },
        {
            label: "Solomon Islands ",
            value: "Solomon Islands "
        },
        {
            label: "Somalia",
            value: "Somalia"
        },
        {
            label: "South Africa",
            value: "South Africa"
        },
        {
            label: "South Korea ",
            value: "South Korea "
        },
        {
            label: "South Sudan ",
            value: "South Sudan "
        },
        {
            label: "Spain",
            value: "Spain"
        },
        {
            label: "Sri Lanka ",
            value: "Sri Lanka "
        },
        {
            label: "Sudan",
            value: "Sudan"
        },
        {
            label: "Suriname",
            value: "Suriname"
        },
        {
            label: "Swaziland ",
            value: "Swaziland "
        },
        {
            label: "Sweden ",
            value: "Sweden "
        },
        {
            label: "Switzerland ",
            value: "Switzerland "
        },
        {
            label: "Syria",
            value: "Syria"
        },
        {
            label: "Taiwan ",
            value: "Taiwan "
        },
        {
            label: "Tajikistan",
            value: "Tajikistan"
        },
        {
            label: "Tanzania",
            value: "Tanzania"
        },
        {
            label: "Thailand",
            value: "Thailand"
        },
        {
            label: "Timor-Leste ",
            value: "Timor-Leste "
        },
        {
            label: "Togo ",
            value: "Togo "
        },
        {
            label: "Tonga",
            value: "Tonga"
        },
        {
            label: "Trinidad and Tobago ",
            value: "Trinidad and Tobago "
        },
        {
            label: "Tunisia",
            value: "Tunisia"
        },
        {
            label: "Turkey ",
            value: "Turkey "
        },
        {
            label: "Turkmenistan",
            value: "Turkmenistan"
        },
        {
            label: "Tuvalu ",
            value: "Tuvalu "
        },
        {
            label: "Uganda ",
            value: "Uganda "
        },
        {
            label: "Ukraine",
            value: "Ukraine"
        },
        {
            label: "United Arab Emirates (UAE)",
            value: "United Arab Emirates (UAE)"
        },
        {
            label: "United Kingdom (UK) ",
            value: "United Kingdom (UK) "
        },
        {
            label: "United States of America (USA) ",
            value: "United States of America (USA) "
        },
        {
            label: "Uruguay",
            value: "Uruguay"
        },
        {
            label: "Uzbekistan",
            value: "Uzbekistan"
        },
        {
            label: "Vanuatu",
            value: "Vanuatu"
        },
        {
            label: "Vatican City (Holy See) ",
            value: "Vatican City (Holy See) "
        },
        {
            label: "Venezuela ",
            value: "Venezuela "
        },
        {
            label: "Vietnam",
            value: "Vietnam"
        },
        {
            label: "Yemen",
            value: "Yemen"
        },
        {
            label: "Zambia ",
            value: "Zambia "
        },
        {
            label: "Zimbabwe",
            value: "Zimbabwe"
        }];


    payment_method: BeckiFormSelectOption[] = [{label: "Bank transfer", value: "bank"}, {
        label: "Credit card payment",
        value: "credit_card"
    }];
    payment_mode: BeckiFormSelectOption[] = [{label: "Monthly", value: "monthly"}, {
        label: "Annual",
        value: "annual"
    }, {label: "Per credit", value: "per_credit"}];
    options: BeckiFormSelectOption[] = [{label: "CZK", value: "CZK"}, {label: "EUR", value: "EUR"}];

    constructor(injector: Injector) {
        super(injector);

        this.step = 1;

        this.form = this.formBuilder.group({
            "city": ["", [Validators.required, Validators.minLength(5)]],

            "company_authorized_email": ["", [BeckiValidators.condition(()=>this.isCompany, Validators.required), BeckiValidators.condition(()=>this.isCompany, Validators.minLength(4))]], //company only

            "company_authorized_phone": ["", [BeckiValidators.condition(()=>this.isCompany, Validators.minLength(4)), BeckiValidators.condition(()=>this.isCompany, BeckiValidators.number)]], //company only

            "company_invoice_email": ["", [BeckiValidators.condition(()=>this.isCompany, Validators.minLength(4)), BeckiValidators.condition(()=>this.isCompany, BeckiValidators.email)]], //company only

            "company_name": ["", [BeckiValidators.condition(()=>this.isCompany, Validators.minLength(4))]], //company only

            "company_web": ["", [BeckiValidators.condition(()=>this.isCompany, Validators.minLength(4))]], //company only

            "country": ["", [Validators.required, Validators.minLength(4)]],

            "vat_number": ["", [BeckiValidators.condition(()=>this.isCompany, Validators.required)]], //Required: only if account is business & from EU!!! CZ28496639 The VAT_number must have at least 4 characters

            "currency_type": ["", [Validators.required]],

            "payment_method": ["", [Validators.required]], // * @description Required: only in if required_payment_mode is truevalues =>[bank, credit_card]

            "payment_mode": ["", [Validators.required]], //only if is requred payment is true

            "product_individual_name": ["", [Validators.required, Validators.minLength(5)]],

            "registration_no": ["", [BeckiValidators.condition(()=>this.isCompany, Validators.required)]], //Required: only if account is businessThe company_registration_no must have at least

            "street": ["", [Validators.required, Validators.minLength(5)]],

            "street_number": ["", [Validators.required, BeckiValidators.number]],

            "tariff_type": [""], //??

            "zip_code": ["", [Validators.required, Validators.minLength(5)]],

        })
    };

    stepClick(step: number): void {
        this.step = step;
    }

    ngOnInit(): void {


        this.backendService.getAllTarifsForRegistrations()
            .then(products => {
                this.tariffForRegistration = products.tariffs;
                this.packageForRegistration = products.packages;
            }).then(()=>{
            this.routeParamsSubscription = this.activatedRoute.params.subscribe(params => {
                if (params.hasOwnProperty("tariff") && this.tariffForRegistration.find(tariff =>{if(tariff.identificator==params["tariff"]){return true;}})){
                    this.checkPaymentMode(params["tariff"]);
                    this.step = 2;
                }else{
                    this.step=1;
                }})

        })
            .catch(error => console.log(error))



    }

    checkPaymentMode(tarifIdentificator:String):void{
        this.form.controls["tariff_type"].setValue(tarifIdentificator);
        console.log("yay "+ this.form.controls["tariff_type"].value)
        this.tariffForRegistration.find(pay => {
            if (pay.identificator == this.form.controls["tariff_type"].value) {
                this.paymentNeed = pay.required_payment_mode;
                this.isCompany = pay.company_details_required;
            }else{
                return false;
            }
        })
    }

    chooseTariff(tariff: IGeneralTariff): void {
        this.checkPaymentMode(tariff.identificator);
        this.step = 2;
    }

    onSubmitClick(): void {
        this.backendService.createTarif({
            tariff_type: this.form.controls["tariff_type"].value,
            product_individual_name: this.form.controls["product_individual_name"].value,
            currency_type: this.form.controls["currency_type"].value,
            payment_mode: this.form.controls["payment_mode"].value,
            payment_method: this.form.controls["payment_method"].value,
            street: this.form.controls["street"].value,
            street_number: this.form.controls["street_number"].value,
            city: this.form.controls["city"].value,
            zip_code: this.form.controls["zip_code"].value,
            country: this.form.controls["country"].value,
            registration_no: this.form.controls["registration_no"].value,
            vat_number: this.form.controls["vat_number"].value,
            company_name: this.form.controls["company_name"].value,
            company_authorized_email: this.form.controls["company_authorized_email"].value,
            company_authorized_phone: this.form.controls["company_authorized_phone"].value,
            company_web: this.form.controls["company_web"].value,
            company_invoice_email: this.form.controls["company_invoice_email"].value,
        })
            .then(tarif => {
                this.step = 3;
                this.serverResponse = tarif;
                if (tarif.gw_url) { // TODO přetypovat na (any) a tím vyřešit tento error
                    this.flashMessagesService.addFlashMessage(new FlashMessageWarning("Product was created but payment is requred, click", "<a href={{(IGoPayUrl)response.gw_url}}>here</a>"));
                } else {
                    this.flashMessagesService.addFlashMessage(new FlashMessageSuccess("Product was created, now you can create a new project"));
                }
            })
            .catch(reason => {
                this.addFlashMessage(new FlashMessageError(`The product cannot be bought.`, reason));
            })
    }
}





