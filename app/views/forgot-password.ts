/**
 * Created by dominikkrisztof on 24/08/16.
 */

import {Component, Injector, OnInit} from '@angular/core';
import {LayoutMain} from "../layouts/main";
import * as ngCore from "@angular/core";
import {CORE_DIRECTIVES} from "@angular/common";
import {BaseMainComponent} from "./BaseMainComponent";
import {LayoutNotLogged} from "../layouts/not-logged";
import {BeckiFormInput} from "../components/BeckiFormInput";
import {REACTIVE_FORM_DIRECTIVES, Validators, FormGroup, FormBuilder} from "@angular/forms";
import {BeckiValidators} from "../helpers/BeckiValidators";
import {FlashMessagesComponent} from "../components/FlashMessagesComponent";
import {FlashMessageSuccess, FlashMessageError, FlashMessagesService} from "../services/FlashMessagesService";
import {BackendService} from "../services/BackendService";
import {Router} from "@angular/router";


@Component({
    selector: "forgotPassword",
    directives: [LayoutNotLogged,CORE_DIRECTIVES, REACTIVE_FORM_DIRECTIVES, BeckiFormInput],
    templateUrl: "app/views/forgot-password.html"
})
export class ForgotPasswordComponent implements OnInit{

    forgotPasswordForm:FormGroup;

    showSuccess:boolean;
    showFailed:boolean;
    failedReason:string;

    constructor(protected formBuilder:FormBuilder,protected router:Router,protected backendService:BackendService,protected flashMessagesService:FlashMessagesService ) {

        this.forgotPasswordForm = this.formBuilder.group({
            "email": ["", [Validators.required, BeckiValidators.email]]
        });
    }


    ngOnInit(): void {

    }

    sendRecovery():void {
        this.backendService.recoveryMailPersonPassword({mail:this.forgotPasswordForm.controls["email"].value})
            .then(() => {
                this.flashMessagesService.addFlashMessage(new FlashMessageSuccess("email with instructions was sent"));
                //this.router.navigate(["/"]);

            })
            .catch(reason => {
                this.flashMessagesService.addFlashMessage(new FlashMessageError("email cannot be sent, " + reason));
                console.log("err send recovery"+reason);
            })
    }

    clickButtonBack():void{
        //this.router.navigate(["/"]);
    }

}

