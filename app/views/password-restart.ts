/**
 * Created by dominik krisztof on 02/09/16.
 */

import {Component, Injector, OnInit, OnDestroy} from '@angular/core';
import {LayoutMain} from "../layouts/main";
import * as ngCore from "@angular/core";
import {CORE_DIRECTIVES} from "@angular/common";
import {BaseMainComponent} from "./BaseMainComponent";
import {BackEndService} from "../services/BackEndService";
import {LayoutNotLogged} from "../layouts/not-logged";
import {BeckiFormInput} from "../components/BeckiFormInput";
import {REACTIVE_FORM_DIRECTIVES, Validators, FormGroup} from "@angular/forms";
import {BeckiValidators} from "../helpers/BeckiValidators";
import {Subscription} from "rxjs";
import {ROUTER_DIRECTIVES} from "@angular/router";

@Component({
    selector: "PasswordRestart",
    directives: [LayoutNotLogged, CORE_DIRECTIVES, REACTIVE_FORM_DIRECTIVES, BeckiFormInput, ROUTER_DIRECTIVES],
    templateUrl: "app/views/password-restart.html"
})
export class passwordRestartComponent extends BaseMainComponent implements OnInit, OnDestroy {

    passwordRestartForm: FormGroup;

    routeParamsSubscription: Subscription;

    token: string;

    constructor(injector: Injector, protected backEndService: BackEndService) {
        super(injector);

        this.passwordRestartForm = this.formBuilder.group({
            "email": ["", [Validators.required, BeckiValidators.email]],
            "password": ["", [Validators.required]],
            "confirmpassword": ["", [Validators.required]]
            //TODO dodělat zítra validátor na confirm password
        });
    }

    onSubmit(): void {
            //TODO nechtělo by to udělat <form> na toto?
        this.backEndService.PasswordRecovery(this.passwordRestartForm.controls["email"].value, this.token, this.passwordRestartForm.controls["confirmpassword"].value).then(()=> {
            //TODO hned přihlásí a přesměruje? pošle flash message
        })
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

