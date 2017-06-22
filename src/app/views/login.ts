/**
 * Created by davidhradek on 03.08.16.
 */

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { BackendService } from '../services/BackendService';
import { BeckiValidators } from '../helpers/BeckiValidators';
import { PermissionMissingError, UserNotValidatedError } from '../backend/BeckiBackend';
import { BlockUIService } from '../services/BlockUIService';
import { IPersonAuthentication } from '../backend/TyrionAPI';
import { Subscription } from 'rxjs';
import { TranslationService } from '../services/TranslationService';


const REDIRECT_URL = `${window.location.protocol}//${window.location.host}/login;state=[_status_]`;

@Component({
    selector: 'bk-view-login',
    templateUrl: './login.html'
})
export class LoginComponent implements OnInit, OnDestroy {

    loginForm: FormGroup;

    loginError: string = null;

    resendVertification: boolean = false;
    routeParamsSubscription: Subscription;

    constructor(
        private backendService: BackendService,
        private formBuilder: FormBuilder,
        private router: Router,
        private blockUIService: BlockUIService,
        private translationService: TranslationService,
        protected activatedRoute: ActivatedRoute
    ) {
        this.loginForm = this.formBuilder.group({
            'email': ['', [Validators.required, BeckiValidators.email]],
            'password': ['', [Validators.required, Validators.minLength(8)]]
        });
    }

    ngOnInit(): void {
        this.routeParamsSubscription = this.activatedRoute.params.subscribe(params => {
            if (typeof params['state'] !== 'undefined' && params['state'] !== 'success') {
                this.loginError = this.translationService.translate('msg_login_error', this);
            }
        });
    }

    ngOnDestroy(): void {
        this.routeParamsSubscription.unsubscribe();
    }

    redirect(url: string): void {
        location.href = url;
    }

    onResendClick(): void {
        this.blockUIService.blockUI();

        this.backendService.createPersonAuthenticationEmail({ mail: this.loginForm.controls['email'].value })
            .then(() => {
                this.blockUIService.unblockUI();
                this.resendVertification = false;
                this.loginError = this.translationService.translate('msg_login_error', this);
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
                    this.loginError = this.translationService.translate('flash_password_change_fail', this, null, [(<UserNotValidatedError>reason).userMessage]);
                    this.resendVertification = true;
                } else {
                    if (reason.userMessage) {
                        this.loginError = this.translationService.translate('msg_login_user_cant_login', this, null, reason.userMessage);
                    } else {
                        this.loginError = this.translationService.translate('msg_login_user_cant_login', this, null, reason);
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
                        this.loginError = this.translationService.translate('msg_login_user_cant_login', this, null, reason.userMessage);
                    } else {
                        this.loginError = this.translationService.translate('msg_login_user_cant_login', this, null, reason);
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
                        this.loginError = this.translationService.translate('msg_login_user_cant_login', this, null, reason.userMessage);
                    } else {
                        this.loginError = this.translationService.translate('msg_login_user_cant_login', this, null, reason);
                    }
                }
            });
    }

    onCloseAlertClick(): void {
        this.loginError = null;
    }

}
