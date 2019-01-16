/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TyrionBackendService } from '../services/BackendService';
import { TranslationService } from '../services/TranslationService';
import {  NotificationService } from '../services/NotificationService';
import { IError } from '../services/_backend_class/Responses';


@Component({
    selector: 'bk-view-logout',
    templateUrl: './logout.html'
})
export class LogoutComponent {

    logoutError: string = null;

    logoutInProgress: boolean = false;

    constructor(private backendService: TyrionBackendService, private router: Router, private translationService: TranslationService, protected notificationService: NotificationService, ) {

        this.logout();

    }

    logout(): void {
        this.logoutInProgress = true;
        this.backendService.logout()
            .then(() => {
                this.logoutInProgress = false;
                this.router.navigate(['/login']);
            })
            .catch((reason: IError) => {
                this.notificationService.fmError(reason);
                this.logoutInProgress = false;
                this.logoutError = this.translationService.translate('msg_logout_cant_log_out', this, null, [reason.message]);
            });
    }

    onCloseAlertClick(): void {
        this.logoutError = null;
    }

}
