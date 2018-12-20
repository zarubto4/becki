/**
 * Created by dominikkrisztof on 24/08/16.
 */

import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { BeckiValidators } from '../helpers/BeckiValidators';
import { FlashMessageSuccess, FlashMessageError, NotificationService } from '../services/NotificationService';
import { TyrionBackendService } from '../services/BackendService';
import { Router } from '@angular/router';
import { TranslationService } from '../services/TranslationService';
import { IError } from '../services/_backend_class/Responses';


@Component({
    selector: 'bk-view-forgot-password',
    templateUrl: './login-forgot-password.html'
})
export class ForgotPasswordComponent implements OnInit {

    forgotPasswordForm: FormGroup;

    showSuccess: boolean;
    showFailed: boolean;
    failedReason: string;

    constructor(protected formBuilder: FormBuilder, protected router: Router, protected backendService: TyrionBackendService, protected notificationService: NotificationService, protected translationService: TranslationService) {

        this.forgotPasswordForm = this.formBuilder.group({
            'email': ['', [Validators.required, BeckiValidators.email]]
        });
    }


    ngOnInit(): void {

    }

    sendRecovery(): void {
        this.backendService.emailSendPasswordRecoveryEmail({
            email: this.forgotPasswordForm.controls['email'].value
        })
            .then(() => {
                this.notificationService.addFlashMessage(new FlashMessageSuccess(this.translationService.translate('flash_email_sent', this)));
                this.router.navigate(['/']);

            })
            .catch((reason: IError) => {
                this.notificationService.addFlashMessage(new FlashMessageError(this.translationService.translate('flash_email_not_sent', reason.message)));
                console.error('err send recovery' + reason);
            });
    }

    clickButtonBack(): void {
        this.router.navigate(['/']);
    }

}
