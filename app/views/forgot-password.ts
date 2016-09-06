/**
 * Created by dominikkrisztof on 24/08/16.
 */

import {Component, Injector, OnInit} from '@angular/core';
import {LayoutMain} from "../layouts/main";
import * as ngCore from "@angular/core";
import {CORE_DIRECTIVES} from "@angular/common";
import {BaseMainComponent} from "./BaseMainComponent";
import {BackEndService} from "../services/BackEndService";
import {LayoutNotLogged} from "../layouts/not-logged";
import {BeckiFormInput} from "../components/BeckiFormInput";
import {REACTIVE_FORM_DIRECTIVES, Validators, FormGroup} from "@angular/forms";
import {BeckiValidators} from "../helpers/BeckiValidators";

@Component({
    selector: "forgotPassword",
    directives: [LayoutNotLogged,CORE_DIRECTIVES, REACTIVE_FORM_DIRECTIVES, BeckiFormInput],
    templateUrl: "app/views/forgot-password.html"
})
export class ForgotPasswordComponent extends BaseMainComponent implements OnInit{

    forgotPasswordForm:FormGroup;

    showSuccess:boolean;
    showFailed:boolean;
    failedReason:string;

    constructor(injector:Injector,protected backEndService:BackEndService) {
        super(injector);

        this.forgotPasswordForm = this.formBuilder.group({
            "email": ["", [Validators.required, BeckiValidators.email]]
        });

        this.showFailed=false;
        this.showSuccess=true;
        this.failedReason="Lol 420 blaze it";
    }


    ngOnInit(): void {

    }

    sendRecovery():void {
        this.backEndService.sendPasswordRecovery(this.forgotPasswordForm.controls["email"].value)
            .then(() => {
                this.showSuccess = true;
                this.showFailed = false;
                console.log(this.showSuccess);
            })
            .catch(reason => {
                this.showSuccess = true;
                this.showFailed = false;
                this.failedReason = reason
            })
    }

    clickButtonBack():void{
        this.router.navigate(["/"]);
    }

}

