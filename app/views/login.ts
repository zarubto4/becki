/**
 * Created by davidhradek on 03.08.16.
 */

import {Component} from "@angular/core";
import {Router} from "@angular/router";
import {FormGroup, Validators, FormBuilder} from "@angular/forms";
import {BackendService} from "../services/BackendService";
import {BeckiValidators} from "../helpers/BeckiValidators";
import {PermissionMissingError} from "../backend/BeckiBackend";
import {BlockUIService} from "../services/BlockUIService";

const REDIRECT_URL = `${window.location.pathname}`;

@Component({
    selector: "view-login",
    templateUrl: "app/views/login.html"
})
export class LoginComponent {

    loginForm: FormGroup;

    loginError: string = null;

    constructor(private backendService: BackendService, private formBuilder: FormBuilder, private router: Router, private blockUIService: BlockUIService) {

        this.loginForm = this.formBuilder.group({
            "email": ["", [Validators.required, BeckiValidators.email]],
            "password": ["", [Validators.required, Validators.minLength(8)]]
        });

    }

    redirect(url: string): void {
        location.href = url;
    }

    onLoginClick(): void {
        this.blockUIService.blockUI();
        this.backendService.login(this.loginForm.controls["email"].value, this.loginForm.controls["password"].value)
            .then(() => {
                this.blockUIService.unblockUI();
                this.router.navigate(["/"]);
            })
            .catch(reason => {
                this.blockUIService.unblockUI();
                if (reason instanceof PermissionMissingError) {
                    this.loginError = (<PermissionMissingError>reason).userMessage;
                } else {
                    this.loginError = "The user cannot be logged in.\n" + reason;
                }
            });
    }

    onFacebookLoginInClick(): void {
        this.blockUIService.blockUI();
        this.backendService.loginFacebook(REDIRECT_URL)
            .then(url => {
                this.blockUIService.unblockUI();
                this.redirect(url)
            })
            .catch(reason => {
                this.blockUIService.unblockUI();
                if (reason instanceof PermissionMissingError) {
                    this.loginError = (<PermissionMissingError>reason).userMessage;
                } else {
                    this.loginError = "The user cannot be logged in.\n" + reason;
                }
            });
    }

    onGitHubLoginInClick(): void {
        this.blockUIService.blockUI();
        this.backendService.loginGitHub(REDIRECT_URL)
            .then(url => {
                this.blockUIService.unblockUI();
                this.redirect(url)
            })
            .catch(reason => {
                this.blockUIService.unblockUI();
                if (reason instanceof PermissionMissingError) {
                    this.loginError = (<PermissionMissingError>reason).userMessage;
                } else {
                    this.loginError = "The user cannot be logged in.\n" + reason;
                }
            });
    }

    onCloseAlertClick(): void {
        this.loginError = null;
    }

}
