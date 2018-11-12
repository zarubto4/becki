/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */


import moment = require('moment/moment');
import { Injectable, NgZone } from '@angular/core';
import { TyrionBackendService } from './BackendService';
import { INotification, INotificationElement, INotificationButton } from '../backend/TyrionAPI';
import { NullSafe } from '../helpers/NullSafe';
import { Router } from '@angular/router';
import { TranslationService } from './TranslationService';


export abstract class Notification {

    visited: boolean = false;

    htmlBody: string = '';
    elementsBody: INotificationElement[] = null;

    isTop: boolean = false;
    opened: boolean = false;
    closed: boolean = false;
    overed: boolean = false;
    closeTime: number = 5000;
    notificationService: NotificationService = null;

    relativeTime: string = '';

    highImportance: boolean = false;
    wasRead: boolean = false;
    confirmed: boolean = false;

    buttons: INotificationButton[] = null;


    /*tslint:disable:no-use-before-declare*/
    public static fromINotification(n: INotification): Notification {

        // console.log('fromINotification notificaton:', n);

        let out: Notification = null;

        switch (n.notification_level) {
            case 'INFO':
                out = new NotificationInfo(n.id, n.notification_body, n.created);
                break;
            case 'SUCCESS':
                out = new NotificationSuccess(n.id, n.notification_body, n.created);
                break;
            case 'WARNING':
                out = new NotificationWarning(n.id, n.notification_body, n.created);
                break;
            case 'ERROR':
                out = new NotificationError(n.id, n.notification_body, n.created);
                break;
        }

        /*tslint:enable:no-use-before-declare*/

        if (out) {
            if (n.notification_importance === 'HIGH') {
                out.highImportance = true;
            }
            if (n.was_read) {
                out.wasRead = n.was_read;
            }
            if (n.confirmed) {
                out.confirmed = n.confirmed;
            }
            if (n.buttons) {
                out.buttons = n.buttons;
            }
            if (n.notification_importance === 'LOW') {
                out.wasRead = true;
            }
        }

        if (n.notification_type === 'CHAIN_START' || n.notification_type === 'CHAIN_UPDATE' || n.notification_type === 'CHAIN_END') {
            out.closeTime = null;
        } else {
            out.closeTime = 5000;
        }

        return out;
    }

    constructor(public id: string, public type: string, public icon: string, body: string | INotificationElement[], public time: number, reason?: Object) {

        // console.log('Notification Constructor notificaton id:', id, ' type: ', type, 'icon', icon, 'body: ', body, 'time', time, 'reason: ', reason);

        if (typeof body === 'string') {

            // console.log('Notification Constructor - Body type is string');

            this.htmlBody = body;
            let userMessage = NullSafe(() => <string>(<any>reason).userMessage);
            let error = NullSafe(() => <string>(<any>reason).error);
            let bodyMessage = NullSafe(() => <string>(<any>reason).body.message);
            if (userMessage) {
                this.htmlBody += '<b>' + userMessage + '</b>' + '<br>';

            } else if (bodyMessage) {
                this.htmlBody += '<<b>' + bodyMessage + '</b>' + '<br>';
            } else if (error) {
                this.htmlBody += '<b>' + error + '</b>' + '<br>';
            }
        } else {
            // console.log('Notification Constructor - Body type is INotificationElement');
            this.elementsBody = body;
        }

        // ITs Reason Error IError object
        if (reason != null) {
            this.htmlBody += '<b>Error Status:: ' + reason['code'] + '<br>';
            this.htmlBody += '<b>Name: <b>' + reason['name'] + '<br>';
            this.htmlBody += '<b>Message: </b>' + reason['message'] + '<br>';
            if ('exception' in reason) {
                this.htmlBody += '<b> Exception::</b>' + '<br>';
                this.htmlBody += JSON.stringify(reason['exception'], null, 3);
            }
        }
        if (this.elementsBody != null && this.elementsBody.length) {
            this.closeTime = ((((this.elementsBody.length / 5) / 180) * 60) * 1000) + 1500;
        } else if (this.htmlBody != null && this.htmlBody.length) {
            this.closeTime = ((((this.htmlBody.length / 5) / 180) * 60) * 1000) + 1500;
        } else {
            this.closeTime = 4000;
        }

        if (this.closeTime > 20000) {
            this.closeTime = 20000;
        }

        this.tick(0);
    }

    public update(n: INotification) {
        if (n.was_read) {
            this.wasRead = n.was_read;
        }
        if (n.confirmed) {
            if (!this.confirmed && !this.closed) {
                this.close();
            }
            this.confirmed = n.confirmed;
        }
        if (n.buttons) {
            this.buttons = n.buttons;
        }
        if (n.notification_body && Array.isArray(n.notification_body)) {
            this.elementsBody = n.notification_body;
        }
        if (n.notification_type === 'CHAIN_END') {
            this.closeTime = 5000;
        }
    }

    closeProgressWidth(): string {
        if (this.closeTime === null) {
            return '0%';
        }
        return ((5000 - this.closeTime) / 50) + '%';
    }

    visit(): void {
        if (this.visited) {
            return;
        }
        this.visited = true;
        setTimeout(() => {
            this.opened = true;
        }, 5);
    }

    overlayTick(tickInterval: number): void {
        if (this.closed) {
            return;
        }
        if (this.overed) {
            return;
        }
        if (this.highImportance) {
            return;
        }
        if (this.closeTime === null) {
            return;
        }
        this.closeTime -= tickInterval;
        if (this.closeTime <= 0) {
            this.close();
        }
    }

    tick(tickInterval: number): void {
        if (!this.time) {
            return;
        }
        this.relativeTime = moment(this.time).fromNow();
    }

    over(): void {
        this.overed = true;
    }

    out(): void {
        this.overed = false;
    }

    close(): void {
        if (this.closed) {
            return;
        }
        this.closed = true;
        setTimeout(() => {
            if (this.notificationService) {
                this.notificationService.removeOverlayNotification(this);
            }
            this.notificationService = null;
        }, 500);
    }

}

// Remote notifications
export class NotificationSuccess extends Notification {
    constructor(public id: string, body: INotificationElement[], time: number) {
        super(id, 'success', 'check-circle', body, time);
    }
}

export class NotificationInfo extends Notification {
    constructor(public id: string, body: INotificationElement[], time: number) {
        super(id, 'info', 'info-circle', body, time);
    }
}

export class NotificationWarning extends Notification {
    constructor(public id: string, body: INotificationElement[], time: number) {
        super(id, 'warning', 'exclamation-triangle', body, time);
    }
}

export class NotificationError extends Notification {
    constructor(public id: string, body: INotificationElement[], time: number) {
        super(id, 'danger', 'times-circle', body, time);
    }
}

// Local flash messages notifications
export abstract class FlashMessage extends Notification {
    constructor(public type: string, icon: string, body: string, reason: Object) {
        super(null, type, icon, body, null, reason);
    }
}

export class FlashMessageSuccess extends FlashMessage {
    constructor(body: string, reason?: Object) {
        super('success', 'check-circle', body, reason);
    }
}

export class FlashMessageInfo extends FlashMessage {
    constructor(body: string, reason?: Object) {
        super('info', 'info-circle', body, reason);
    }
}

export class FlashMessageWarning extends FlashMessage {
    constructor(body: string, reason?: Object) {
        super('warning', 'exclamation-triangle', body, reason);
    }
}

export class FlashMessageError extends FlashMessage {
    constructor(body: string, reason?: Object) {
        super('danger', 'times-circle', body, reason);
    }
}

@Injectable()
export class NotificationService {

    public notifications: Notification[] = [];

    public toolbarNotifications: Notification[] = []; // toolbar

    public overlayNotifications: Notification[] = [];

    public unreadNotificationsCount: number = 0;
    public totalNotificationsCount: number = 0;

    public highImportanceOverlay: boolean = false;
    public highImportanceOverlayOpen: boolean = false;

    protected highImportanceOverlayTimeout: any = null;

    constructor(protected backendService: TyrionBackendService, protected router: Router, protected zone: NgZone, protected translationService: TranslationService) {
        // console.info('NotificationService init');

        // tick for overlay notifs
        this.zone.runOutsideAngular(() => {
            setInterval(() => {
                this.overlayNotifications.forEach((n) => {
                    n.overlayTick(100);
                });
                // trigger change detection if some notif ticked
                if (this.overlayNotifications.length) {
                    this.zone.run(() => { });
                }
            }, 100);

            // tick for all notifs
            setInterval(() => {
                this.notifications.forEach((n) => {
                    n.tick(10000);
                });
                // trigger change detection if some notif ticked
                if (this.notifications.length) {
                    this.zone.run(() => { });
                }
            }, 10000);
        });

        // update notifications info only when user is logged in
        if (this.backendService.personInfoSnapshot) {
            this.backendService.notificationsGetUnconfirmed();
            this.getRestApiNotifications();
        }

        // and update notifications info after user log in/out
        this.backendService.personInfo.subscribe((pi) => {
            if (pi) {
                this.notificationCleanAll();
                this.backendService.notificationsGetUnconfirmed();
                this.getRestApiNotifications();
            } else {
                this.notificationCleanAll();
            }
        });

        // register error handler for websocket error
        this.backendService.webSocketErrorOccurred.subscribe(error => {
            this.addFlashMessage(new FlashMessageError(this.translate('flash_communication_failed')));
        });

        // subscribe websocket notifications
        this.backendService.notificationReceived.subscribe(notification => {
            // console.log('backendService.notificationReceived.subscribe: ', notification);
            if (notification.message_type === 'subscribe_notification' || notification.message_type === 'unsubscribe_notification') {
                // console.log('(un)subscribed');
            } else {
                // console.log('Notification:', notification);
                this.zone.runOutsideAngular(() => {
                    if (notification.state === 'CREATED') {
                        if (notification.id && this.isNotificationExists(notification.id)) {
                            // console.log('notification Exist');
                            let notif = this.notifications.find((n) => n.id === notification.id);
                            if (notif) {
                                let oldWasRead = notif.wasRead;
                                notif.update(notification);
                                // wasRead changes to true
                                if (oldWasRead === false && notif.wasRead === true) {
                                    this.unreadNotificationsCount--;
                                }
                            }

                        } else if (notification.id && this.overlayNotifications.find((n) => n.id === notification.id)) {
                            // console.log('overlayNotifications');
                            let notif = this.overlayNotifications.find((n) => n.id === notification.id);
                            if (notif) {
                                let oldWasRead = notif.wasRead;
                                notif.update(notification);
                                // wasRead changes to true
                                if (oldWasRead === false && notif.wasRead === true) {
                                    this.unreadNotificationsCount--;
                                }
                            }
                        } else {
                            // console.log('i will parse fromINotification');
                            let notif: Notification = Notification.fromINotification(notification);
                            // console.log('backendService.notificationReceived.subscribe: ', notif);
                            switch (notification.notification_importance) {
                                case 'LOW':
                                    this.addOverlayNotification(notif);
                                    break;
                                case 'NORMAL':
                                    if (!notif.wasRead) {
                                        this.unreadNotificationsCount++;
                                    }
                                    this.totalNotificationsCount++;

                                    this.addSavedNotification(notif);
                                    this.addOverlayNotification(notif);
                                    break;
                                case 'HIGH':
                                    if (!notif.wasRead) {
                                        this.unreadNotificationsCount++;
                                    }
                                    this.totalNotificationsCount++;

                                    this.addSavedNotification(notif);
                                    this.addOverlayNotification(notif);
                                    break;
                            }
                        }
                    } else if ((notification.state === 'UPDATED' || notification.state === 'CONFIRMED') && notification.id) {
                        let notif = this.notifications.find((n) => n.id === notification.id);
                        if (notif) {
                            let oldWasRead = notif.wasRead;
                            notif.update(notification);
                            // wasRead changes to true
                            if (oldWasRead === false && notif.wasRead === true) {
                                this.unreadNotificationsCount--;
                            }
                        }
                    } else if (notification.state === 'DELETED' && notification.id) {
                        let notif = this.removeNotificationById(notification.id);
                        if (notif && notif.wasRead === false) {
                            this.unreadNotificationsCount--;
                        }
                    }

                    // trigger change detection after all done
                    this.zone.run(() => { });
                });
            }
        });
    }

    translate(key: string, ...args: any[]): string {
        return this.translationService.translate(key, this, null, args);
    }

    // flash messages :
    addFlashMessage(fm: FlashMessage): void {
        fm.notificationService = this;
        this.overlayNotifications.unshift(fm);
    }

    // remove message (called on click on close btn in FlashMessagesComponent)
    removeFlashMessage(fm: FlashMessage): void {
        fm.notificationService = null;
        let index = this.overlayNotifications.indexOf(fm);
        if (index > -1) {
            this.overlayNotifications.splice(index, 1);
        }
    }

    addOverlayNotification(n: Notification): void {
        n.notificationService = this;
        this.overlayNotifications.unshift(n);

        // this.markNotificationsRead([n]); // TODO: only when mouse moved

        let high = false;
        this.overlayNotifications.forEach((nn) => {
            if (nn.highImportance) {
                high = true;
            }
        });
        this.setHighImportanceOverlay(high);
    }

    // remove notification (called on click on close btn in NotificationOverlayComponent)
    removeOverlayNotification(n: Notification): void {
        n.notificationService = null;
        let index = this.overlayNotifications.indexOf(n);
        if (index > -1) {
            this.overlayNotifications.splice(index, 1);
        }

        let high = false;
        this.overlayNotifications.forEach((nn) => {
            if (nn.highImportance) {
                high = true;
            }
        });
        this.setHighImportanceOverlay(high);
    }

    protected setHighImportanceOverlay(high: boolean) {
        if (this.highImportanceOverlay !== high) {
            if (this.highImportanceOverlayTimeout) {
                clearTimeout(this.highImportanceOverlayTimeout);
            }
            if (high) {
                this.highImportanceOverlay = true;
                this.highImportanceOverlayTimeout = setTimeout(() => {
                    this.highImportanceOverlayOpen = true;
                }, 1);
            } else {
                this.highImportanceOverlayOpen = false;
                this.highImportanceOverlayTimeout = setTimeout(() => {
                    this.highImportanceOverlay = false;
                }, 500);
            }
        }
    }

    addSavedNotification(n: Notification): void {
        this.notifications.unshift(n);
        this.toolbarNotifications = this.notifications.slice(0, 10);
    }

    notificationCleanAll(): void {
        this.unreadNotificationsCount = 0;
        this.notifications = [];
        this.toolbarNotifications = [];
        this.overlayNotifications = [];
    }

    markNotificationsRead(n: Notification[]): void {
        let ids = n.map((nn) => {
            if (nn.id && !nn.wasRead) {
                nn.wasRead = true;
                return nn.id;
            }
            return null;
        }).filter((nnn) => !!nnn);
        if (!ids.length) {
            return;
        }

        if (ids.length) {
            this.zone.run(() => {
                // console.log('MARK READ: ', ids);
                this.unreadNotificationsCount -= ids.length;
                this.backendService.notificationsMarkAsRead({ notification_id: ids }); // TODO: možná něco udělat s chybou :-)
            });
        }
    }

    mouseMove(): void {
        this.markNotificationsRead(this.overlayNotifications);
    }

    onObjectClick(n: Notification, e: INotificationElement) {

        switch (e.name) {
            case 'Project':
                this.router.navigate(['projects', e.id]);
                break;
            case 'Person': console.error('not implemented yet');
                this.router.navigate(['persons', e.id]);
                break;
            case 'BProgramVersion':
                this.router.navigate(['projects', e.project_id, 'blocko', e.program_id, { version: e.id }]);
                break;
            case 'CProgramVersion':
                this.router.navigate(['projects', e.project_id, 'code', e.program_id, { version: e.id }]);
                break;
            case 'BProgram':
                this.router.navigate(['projects', e.project_id, 'blocko', e.id]);
                break;
            case 'Hardware':
                this.router.navigate(['projects', e.project_id, 'hardware', e.id]);
                break;
            case 'CProgram':
                this.router.navigate(['projects', e.project_id, 'code', e.id]);
                break;
            case 'Instance':
                this.router.navigate(['projects', e.project_id, 'instances', e.id]);
                break;
            case 'UpdateProcedure':
                this.router.navigate(['projects', e.project_id, 'actualization_procedures', e.id]);
                break;
            case 'HardwareUpdate':
                this.router.navigate(['projects', e.project_id, 'hardware', e.id,  { tab: 'update'}]);
                break;
        }
    }

    onButtonClick(n: Notification, b: INotificationButton) {
        n.confirmed = true;
        n.close();
        this.backendService.notificationConfirm(n.id, {
            action: b.action,
            payload: b.payload
        })
            .catch((e) => {
                n.confirmed = false; // is this okay?
                this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_confirm_notification', e)));
            });
    }

    onDeleteClick(n: Notification) {

        this.backendService.notificationDelete(n.id)
            .then(() => {
                this.removeNotificationById(n.id);
            })
            .catch(reason => {
                this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_remove_notification', reason)));

            });
    }


    private isNotificationExists(id: string): boolean {
        return !!this.notifications.find((n) => n.id === id);
    }

    private removeNotificationById(id: string): Notification {

        let notif = this.notifications.find((n) => n.id === id);

        let overlayIndex = this.overlayNotifications.findIndex((n) => n.id === id);
        if (overlayIndex > -1) {
            this.overlayNotifications.splice(overlayIndex, 1);
        }

        let notificationIndex = this.notifications.findIndex((n) => n.id === id);
        if (notificationIndex > -1) {
            this.notifications.splice(notificationIndex, 1);
        }

        this.toolbarNotifications = this.notifications.slice(0, 10);

        return notif;
    }

    getRestApiNotifications(page = 1): Promise<Notification[]> {
        return this.backendService.notificationGetLatest(page)
            .then(list => {

                this.zone.runOutsideAngular(() => {

                    this.unreadNotificationsCount = list.unread_total;
                    this.totalNotificationsCount = list.total;

                    list.content.forEach((n) => {
                        // TODO: maybe update it!
                        if (!this.isNotificationExists(n.id)) {
                            let nn = Notification.fromINotification(n);
                            this.notifications.unshift(nn);
                        } else {
                            let notif = this.notifications.find((nnn) => nnn.id === n.id);
                            if (notif) {
                                notif.update(n);
                            }
                        }
                    });

                    this.notifications = this.notifications.sort((a, b) => {
                        if (a.time > b.time) {
                            return -1;
                        } else if (a.time < b.time) {
                            return 1;
                        }
                        return 0;
                    });

                    this.toolbarNotifications = this.notifications.slice(0, 10);

                    // trigger change detection after all done
                    this.zone.run(() => { });
                });

                return this.notifications;
            });
    }
}
