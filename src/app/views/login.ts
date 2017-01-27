/**
 * Created by davidhradek on 03.08.16.
 */

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { BackendService } from '../services/BackendService';
import { BeckiValidators } from '../helpers/BeckiValidators';
import { PermissionMissingError, UserNotValidatedError } from '../backend/BeckiBackend';
import { BlockUIService } from '../services/BlockUIService';
import { IPersonAuthentication } from '../backend/TyrionAPI';


const REDIRECT_URL = `${window.location.pathname}`;

@Component({
    selector: 'bk-view-login',
    templateUrl: './login.html'
})
export class LoginComponent {

    loginForm: FormGroup;

    loginError: string = null;

    resendVertification: boolean= false;

    constructor(private backendService: BackendService, private formBuilder: FormBuilder, private router: Router, private blockUIService: BlockUIService) {

        this.loginForm = this.formBuilder.group({
            'email': ['', [Validators.required, BeckiValidators.email]],
            'password': ['', [Validators.required, Validators.minLength(8)]]
        });

    }

    redirect(url: string): void {
        location.href = url;
    }

    onResendClick(): void {
        this.blockUIService.blockUI();

        this.backendService.createPersonAuthenticationEmail({mail: this.loginForm.controls['email'].value})
            .then(() => {
                this.blockUIService.unblockUI();
                this.resendVertification = false;
                this.loginError = 'Email with vertifiaction was sent';
            })
            .catch(reason => {
                this.blockUIService.unblockUI();
                this.loginError = reason;
            });
    }

    onLoginClick(): void {
        this.blockUIService.blockUI();
        this.backendService.login(this.loginForm.controls['email'].value, this.loginForm.controls['password'].value)
            .then(() => {
                this.blockUIService.unblockUI();
                this.router.navigate(['/']);
            })
            .catch(reason => {
                this.blockUIService.unblockUI();
                if (reason instanceof PermissionMissingError) {
                    this.loginError = (<PermissionMissingError>reason).userMessage;
                } else if (reason instanceof UserNotValidatedError) {
                    this.loginError = (<UserNotValidatedError>reason).userMessage + '\n press resend button to send vertifiaction Email again';
                    this.resendVertification = true;
                } else {
                    if (reason.userMessage) {
                        this.loginError = 'The user cannot be logged in.\n' + reason.userMessage;
                    } else {
                        this.loginError = 'The user cannot be logged in.\n' + reason;
                    }
                }
            });
    }

    onFacebookLoginInClick(): void {
        this.blockUIService.blockUI();
        this.backendService.loginFacebook(REDIRECT_URL)
            .then(url => {
                this.blockUIService.unblockUI();
                this.redirect(url);
            })
            .catch(reason => {
                this.blockUIService.unblockUI();
                if (reason instanceof PermissionMissingError) {
                    this.loginError = (<PermissionMissingError>reason).userMessage;
                } else {
                    if (reason.userMessage) {
                        this.loginError = 'The user cannot be logged in.\n' + reason.userMessage;
                    } else {
                        this.loginError = 'The user cannot be logged in.\n' + reason;
                    }
                }
            });
    }

    onGitHubLoginInClick(): void {
        this.blockUIService.blockUI();
        this.backendService.loginGitHub(REDIRECT_URL)
            .then(url => {
                this.blockUIService.unblockUI();
                this.redirect(url);
            })
            .catch(reason => {
                this.blockUIService.unblockUI();
                if (reason instanceof PermissionMissingError) {
                    this.loginError = (<PermissionMissingError>reason).userMessage;
                } else {
                    if (reason.userMessage) {
                        this.loginError = 'The user cannot be logged in.\n' + reason.userMessage;
                    } else {
                        this.loginError = 'The user cannot be logged in.\n' + reason;
                    }
                }
            });
    }

    onCloseAlertClick(): void {
        this.loginError = null;
    }

}
