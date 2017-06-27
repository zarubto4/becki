/**
 * Created by davidhradek on 03.08.16.
 */

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BackendService } from '../services/BackendService';
import { TranslationService } from '../services/TranslationService';

@Component({
    selector: 'bk-view-logout',
    templateUrl: './logout.html'
})
export class LogoutComponent {

    logoutError: string = null;

    logoutInProgress: boolean = false;

    constructor(private backendService: BackendService, private router: Router, private translationService: TranslationService) {

        this.logout();

    }

    logout(): void {
        this.logoutInProgress = true;
        this.backendService.logout()
            .then(() => {
                this.logoutInProgress = false;
                this.router.navigate(['/login']);
            })
            .catch(reason => {
                this.logoutInProgress = false;
                if (reason.userMessage) {
                    this.logoutError = this.translationService.translate('msg_logout_cant_log_out', this, null, reason.userMessage);
                } else {
                    this.logoutError = this.translationService.translate('msg_logout_cant_log_out', this, null, reason);
                }
            });
    }

    onCloseAlertClick(): void {
        this.logoutError = null;
    }

}
