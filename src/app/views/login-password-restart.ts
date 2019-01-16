/**
 * Created by dominik krisztof on 02/09/16.

 ~ © 2016 Becki Authors. See the AUTHORS file found in the top-level
 ~ directory of this distribution.

 */

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { BeckiValidators } from '../helpers/BeckiValidators';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationService, FlashMessageSuccess } from '../services/NotificationService';
import { TyrionBackendService } from '../services/BackendService';
import { TranslationService } from '../services/TranslationService';
import { IError } from '../services/_backend_class/Responses';


@Component({
    selector: 'bk-view-password-restart',
    templateUrl: './login-password-restart.html'
})
export class PasswordRestartComponent implements OnInit, OnDestroy {

    passwordRestartForm: FormGroup;

    routeParamsSubscription: Subscription;

    token: string;

    constructor(
        protected activatedRoute: ActivatedRoute,
        protected router: Router,
        protected formBuilder: FormBuilder,
        protected backEndService: TyrionBackendService,
        protected notificationService: NotificationService,
        protected translationService: TranslationService,
    ) {

        this.passwordRestartForm = this.formBuilder.group({
            'email': ['', [Validators.required, BeckiValidators.email]],
            'password': ['', [Validators.required, Validators.minLength(8)]],
            'confirmpassword': ['', [Validators.required, BeckiValidators.passwordSame(() => this.passwordRestartForm, 'password')]]
        });
    }

    onSubmit(): void {
        this.backEndService.personRestartPassword({
            email: this.passwordRestartForm.controls['email'].value,
            password_recovery_token: this.token,
            password: this.passwordRestartForm.controls['password'].value
        })
            .then(() => {
                this.notificationService.addFlashMessage(new FlashMessageSuccess(this.translationService.translate('flash_password_change_success', this)));
                this.router.navigate(['/']);
            })
            .catch((reason: IError) => {
                this.notificationService.fmError(reason);
            });
    }


    ngOnInit(): void {
        this.routeParamsSubscription = this.activatedRoute.params.subscribe(params => {
            this.token = params['token'];
        });
    }

    ngOnDestroy(): void {
        this.routeParamsSubscription.unsubscribe();
    }


    clickButtonBack(): void {
        this.router.navigate(['/']);
    }

}

