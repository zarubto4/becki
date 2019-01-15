/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { TyrionBackendService } from '../services/BackendService';
import { BeckiValidators } from '../helpers/BeckiValidators';
import { BlockUIService } from '../services/BlockUIService';
import { Subscription } from 'rxjs';
import { TranslationService } from '../services/TranslationService';
import { FlashMessageError, NotificationService } from '../services/NotificationService';
import { IError } from '../services/_backend_class/Responses';


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
        private backendService: TyrionBackendService,
        private formBuilder: FormBuilder,
        private router: Router,
        private blockUIService: BlockUIService,
        private translationService: TranslationService,
        protected activatedRoute: ActivatedRoute,
        protected notificationService: NotificationService,
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

    onResendValidationClick(): void {
        this.blockUIService.blockUI();

        this.backendService.emailSendAuthentication({ email: this.loginForm.controls['email'].value })
            .then(() => {
                this.blockUIService.unblockUI();
                this.resendVertification = false;
                this.loginError = this.translationService.translate('msg_login_email_sent', this);
            })
            .catch((reason: IError) => {
                this.notificationService.addFlashMessage(new FlashMessageError(this.translationService.translate('flash_fail', this), reason));
                this.blockUIService.unblockUI();
                this.loginError = reason.message;
            });
    }

    onLoginClick(): void {
        this.blockUIService.blockUI();
        this.backendService.login(
            this.loginForm.controls['email'].value,
            this.loginForm.controls['password'].value)
            .then(() => {
                this.blockUIService.unblockUI();
                this.router.navigate(['/']);
            })
            .catch((reason: IError) => {
                this.notificationService.addFlashMessage(new FlashMessageError(this.translationService.translate('msg_login_error', this), reason));
                this.blockUIService.unblockUI();

                console.trace('OnLoginClic Error Code: ', reason);

                // Special exception when verifying errors manually because I do not leave a bug to be notified with "Notification"
                if (reason['code'] === 403) {
                    this.loginError = reason['message'];
                    return;
                }

                // Special exception when verifying errors manually because I do not leave a bug to be notified with "Notification"
                if (reason['code'] === 705) {
                    this.loginError = this.translationService.translate('msg_login_resend_verification', this, null);
                    this.resendVertification = true;
                    return;
                }

                this.loginError = this.translationService.translate('msg_login_user_cant_login', reason.message);

            });
    }

    onFacebookLoginInClick(): void {
        this.blockUIService.blockUI();
        this.backendService.loginFacebook(REDIRECT_URL)
            .then(url => {
                this.blockUIService.unblockUI();
                this.redirect(url);
            })
            .catch((reason: IError) => {
                this.notificationService.addFlashMessage(new FlashMessageError(this.translationService.translate('msg_login_error', this), reason));
                this.blockUIService.unblockUI();

                // Special exception when verifying errors manually because I do not leave a bug to be notified with "Notification"
                if (reason['code'] === 403) {
                    this.loginError = reason['message'];
                    return;
                }
                // Special exception when verifying errors manually because I do not leave a bug to be notified with "Notification"
                if (reason['code'] === 705) {
                    this.loginError = reason.message;
                    this.resendVertification = true;
                    return;
                }

                this.loginError = this.translationService.translate('msg_login_user_cant_login', reason.message);
            });
    }

    /**
    onGitHubLoginInClick(): void {
        this.blockUIService.blockUI();
        this.backendService.loginGitHub(REDIRECT_URL)
            .then(url => {
                this.blockUIService.unblockUI();
                this.redirect(url);
            })
            .catch((reason: IError) => {
                this.notificationService.addFlashMessage(new FlashMessageError(this.translationService.translate('msg_login_error', this), reason));
                this.blockUIService.unblockUI();

                // Special exception when verifying errors manually because I do not leave a bug to be notified with "Notification"
                if (reason['code'] === 403) {
                    this.loginError = reason['message'];
                    return;
                }
                // Special exception when verifying errors manually because I do not leave a bug to be notified with "Notification"
                if (reason['code'] === 705) {
                    this.loginError = this.translationService.translate('msg_login_resend_vertification', this, null);
                    this.resendVertification = true;
                    return;
                }

                this.loginError = this.translationService.translate('msg_login_user_cant_login', this, null, reason['message']);
            });
    }
     */

    onCloseAlertClick(): void {
        this.loginError = null;
    }

}
