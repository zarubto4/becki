/**
 * Created by dominikkrisztof on 23.08.16.
 */


import { Component, Injector, OnInit } from '@angular/core';
import { _BaseMainComponent } from './_BaseMainComponent';
import { NotificationService, FlashMessageError } from '../services/NotificationService';
import { TyrionBackendService } from '../services/BackendService';
import { IError } from '../services/_backend_class/Responses';

@Component({
    selector: 'bk-view-notifications',
    templateUrl: './notifications.html'
})
export class NotificationsComponent extends _BaseMainComponent implements OnInit {

    loading = false;

    notificationService: NotificationService; // exposed for template - filled by _BaseMainComponent

    constructor(injector: Injector) {
        super(injector);
    };

    ngOnInit(): void {
        this.loading = true;
        this.notificationService.getRestApiNotifications()
            .then(() => {
                // delayed mark as read for animation in notifications list (CSS animation)
                setTimeout(() => {
                    this.notificationService.markNotificationsRead(this.notificationService.notifications);
                }, 1);
                this.loading = false;
            })
            .catch((reason: IError) => {
                this.notificationService.addFlashMessage(new FlashMessageError(this.translate('flash_cant_load'), reason));
                this.loading = false;
            });
    }

    canLoadMore(): boolean {
        return (this.notificationService.notifications.length < this.notificationService.totalNotificationsCount);
    }

    onLoadOlderClick(): void {
        if (this.notificationService.notifications.length < this.notificationService.totalNotificationsCount) {
            let page = 1 + Math.floor(this.notificationService.notifications.length / 25); // TODO: mít někde konstantu s počtem notif na page

            this.loading = true;
            this.notificationService.getRestApiNotifications(page)
                .then(() => {
                    // delayed mark as read for animation in notifications list (CSS animation)
                    setTimeout(() => {
                        this.notificationService.markNotificationsRead(this.notificationService.notifications);
                    }, 1);
                    this.loading = false;
                })
                .catch((reason: IError) => {
                    this.notificationService.addFlashMessage(new FlashMessageError(this.translate('flash_cant_load'), reason));
                    this.loading = false;
                });
        }
    }
}
