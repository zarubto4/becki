/**
 * Created by dominik krisztof on 02/09/16.
 */

import {Component, Injector, OnInit, OnDestroy, forwardRef} from '@angular/core';
import {LayoutMain} from "../layouts/main";
import * as ngCore from "@angular/core";
import {CORE_DIRECTIVES} from "@angular/common";
import {BaseMainComponent} from "./BaseMainComponent";
import {LayoutNotLogged} from "../layouts/not-logged";
import {BeckiFormInput} from "../components/BeckiFormInput";
import {REACTIVE_FORM_DIRECTIVES, Validators, FormGroup, FormControl, FormBuilder} from "@angular/forms";
import {BeckiValidators} from "../helpers/BeckiValidators";
import {Subscription} from "rxjs";
import {ROUTER_DIRECTIVES, Router, ActivatedRoute} from "@angular/router";
import {
    FlashMessagesService, FlashMessageSuccess, FlashMessage,
    FlashMessageError
} from "../services/FlashMessagesService";
import {BackendService} from "../services/BackendService";

@Component({
    selector: "PasswordRestart",
    directives: [LayoutNotLogged, CORE_DIRECTIVES, REACTIVE_FORM_DIRECTIVES, BeckiFormInput, ROUTER_DIRECTIVES],
    templateUrl: "app/views/password-restart.html"
})
export class PasswordRestartComponent implements OnInit, OnDestroy {

    passwordRestartForm: FormGroup;

    routeParamsSubscription: Subscription;

    token: string;

    constructor(protected activatedRoute:ActivatedRoute,protected router:Router,protected formBuilder:FormBuilder,protected backEndService:BackendService, protected flashMessagesService: FlashMessagesService) {

        this.passwordRestartForm = this.formBuilder.group({
            "email": ["", [Validators.required, BeckiValidators.email]],
            "password": ["", [Validators.required, Validators.minLength(8)]],
            "confirmpassword": ["", [Validators.required, BeckiValidators.passwordSame(()=>this.passwordRestartForm, "password")]]
        });
    }

    onSubmit(): void {
        this.backEndService.recoveryPersonPassword({mail:this.passwordRestartForm.controls["email"].value, password_recovery_token:this.token, password: this.passwordRestartForm.controls["password"].value})
            .then(()=> {
            this.flashMessagesService.addFlashMessage(new FlashMessageSuccess("password was succesfully changed"));
            this.router.navigate(["/"]);
        })
            .catch(reason => {
            this.flashMessagesService.addFlashMessage(new FlashMessageError("password cannot be changed, " + reason));
        });
    }


    ngOnInit(): void {
        this.routeParamsSubscription = this.activatedRoute.params.subscribe(params => {
            this.token = params["token"];
        })
    }

    ngOnDestroy(): void {
        this.routeParamsSubscription.unsubscribe();
    }


    clickButtonBack(): void {
        this.router.navigate(["/"]);
    }

}

