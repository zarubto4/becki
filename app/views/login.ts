/**
 * Created by davidhradek on 03.08.16.
 */

import {Component} from '@angular/core';
import {CORE_DIRECTIVES} from "@angular/common";
import {Router} from "@angular/router";
import {FormGroup, Validators, FormBuilder, REACTIVE_FORM_DIRECTIVES} from "@angular/forms";

import {BackendService} from "../services/BackendService";
import {BeckiValidators} from "../helpers/BeckiValidators";
import {Nl2Br} from "../pipes/Nl2Br";
import {LayoutNotLogged} from "../layouts/not-logged";
import {BeckiFormInput} from "../components/BeckiFormInput";
import {PermissionMissingError} from "../backend/BeckiBackend";

const REDIRECT_URL = `${window.location.pathname}`;

@Component({
    selector: "view-login",
    templateUrl: "app/views/login.html",
    pipes: [Nl2Br],
    directives: [LayoutNotLogged, CORE_DIRECTIVES, REACTIVE_FORM_DIRECTIVES, BeckiFormInput]
})
export class LoginComponent {

    loginForm: FormGroup;

    loginError: string = null;

    constructor(private backendService:BackendService, private formBuilder: FormBuilder, private router: Router) {

        this.loginForm = this.formBuilder.group({
            "email": ["", [Validators.required, BeckiValidators.email]],
            "password": ["", [Validators.required, Validators.minLength(8)]]
        });

    }

    redirect(url:string):void {
        location.href = url;
    }

    onLoginClick():void {
        this.backendService.login(this.loginForm.controls["email"].value, this.loginForm.controls["password"].value)
            .then(() => this.router.navigate(["/"]))
            .catch(reason => {
                if (reason instanceof PermissionMissingError) {
                    this.loginError = (<PermissionMissingError>reason).userMessage;
                } else {
                    this.loginError = "The user cannot be logged in.\n"+reason;
                }
            });
    }

    onFacebookLoginInClick():void {
        this.backendService.loginFacebook(REDIRECT_URL)
            .then(url => this.redirect(url))
            .catch(reason => {
                if (reason instanceof PermissionMissingError) {
                    this.loginError = (<PermissionMissingError>reason).userMessage;
                } else {
                    this.loginError = "The user cannot be logged in.\n"+reason;
                }
            });
    }

    onGitHubLoginInClick():void {
        this.backendService.loginGitHub(REDIRECT_URL)
            .then(url => this.redirect(url))
            .catch(reason => {
                if (reason instanceof PermissionMissingError) {
                    this.loginError = (<PermissionMissingError>reason).userMessage;
                } else {
                    this.loginError = "The user cannot be logged in.\n"+reason;
                }
            });
    }

    onCloseAlertClick():void {
        this.loginError = null;
    }

}
