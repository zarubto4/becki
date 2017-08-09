/*
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level
 * directory of this distribution.
 */

/**
 * Created by dominikkrisztof on 11/10/16.
 */

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { BeckiValidators } from '../helpers/BeckiValidators';
import { FlashMessageSuccess, FlashMessageError, NotificationService } from '../services/NotificationService';
import { BackendService } from '../services/BackendService';
import { Router, ActivatedRoute } from '@angular/router';
import { BlockUIService } from '../services/BlockUIService';
import { BeckiAsyncValidators } from '../helpers/BeckiAsyncValidators';
import { Subscription } from 'rxjs/Rx';
import { TranslationService } from '../services/TranslationService';


@Component({
    selector: 'bk-view-create-user',
    templateUrl: './create-user.html'
})
export class CreateUserComponent implements OnInit, OnDestroy {

    CreateUserForm: FormGroup;
    routeParamsSubscription: Subscription;

    constructor(
        protected formBuilder: FormBuilder,
        protected router: Router,
        protected backendService: BackendService,
        protected notificationService: NotificationService,
        protected activatedRoute: ActivatedRoute,
        protected translateService: TranslationService,

    ) {
        this.CreateUserForm = this.formBuilder.group({
            'email': ['', [Validators.required, BeckiValidators.email], BeckiAsyncValidators.validateEntity(this.backendService, 'mail')],
            'nick_name': ['', [Validators.required, Validators.minLength(5), Validators.maxLength(60)], BeckiAsyncValidators.validateEntity(this.backendService, 'nick_name')],
            'full_name': ['', [Validators.required, Validators.minLength(8), Validators.maxLength(60)]],
            'password': ['', [Validators.required, Validators.minLength(8), Validators.maxLength(60)]],
            'passwordConfirm': ['', [BeckiValidators.passwordSame(() => this.CreateUserForm, 'password'), Validators.required, Validators.minLength(8), Validators.maxLength(60)]]

        });
    }

    ngOnInit(): void {
        this.routeParamsSubscription = this.activatedRoute.params.subscribe(params => {
            if (params['email']) {
                this.CreateUserForm.controls['email'].setValue(decodeURIComponent(params['email']));
            }
        });
    }

    ngOnDestroy(): void {
        this.routeParamsSubscription.unsubscribe();
    }

    sendCreateUser(): void {
        this.backendService.personCreate({
            nick_name: this.CreateUserForm.controls['nick_name'].value,
            mail: this.CreateUserForm.controls['email'].value,
            password: this.CreateUserForm.controls['password'].value,
            full_name: this.CreateUserForm.controls['full_name'].value
        })
            .then(() => {
                this.notificationService.addFlashMessage(new FlashMessageSuccess(this.translateService.translate('flash_email_was_send', this)));
                this.router.navigate(['/']);
            })
            .catch(reason => {
                this.notificationService.addFlashMessage(new FlashMessageError(this.translateService.translate('flash_email_cant_be_sent', this, null, reason)));
                console.error('err ' + reason);
            });
    }

    clickButtonBack(): void {
        this.router.navigate(['/']);
    }

}

