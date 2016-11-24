/**
 * Created by DominikKrisztof on 22/08/16.
 */
import {Injectable} from "@angular/core";
import {BackendService} from "./BackendService";
import {INotification, INotificationElement, INotificationButton} from "../backend/TyrionAPI";
import {ModalsHighImportanceNotificationModel} from "../modals/high-importance-notification";
import {ModalService} from "../services/ModalService";

import moment = require("moment/moment");
import {IWebSocketNotification} from "../backend/BeckiBackend";

export abstract class Notification {

    visited: boolean = false;

    htmlBody: string = null;
    elementsBody: INotificationElement[] = null;

    isTop: boolean = false;
    opened: boolean = false;
    closed: boolean = false;
    overed: boolean = false;
    closeTime: number = 5000;
    notificationService:NotificationService = null;

    relativeTime: string = "";

    highImportance: boolean = false;
    wasRead:boolean = false;
    confirmed:boolean = false;

    buttons: INotificationButton[] = null;

    constructor(public id: string, public type: string, public icon: string, body: string|INotificationElement[], public time: number, reason?: Object) {
        if (typeof body == "string") {
            this.htmlBody = body;
        } else {
            this.elementsBody = body;
        }
        this.tick(0);
    }

    public static fromINotification(n:INotification):Notification {

        var out:Notification = null;

        switch (n.notification_level) {
            case "info":
                out = new NotificationInfo(n.id, n.notification_body, n.created);
                break;
            case "success":
                out = new NotificationSuccess(n.id, n.notification_body, n.created);
                break;
            case "warning":
                out = new NotificationWarning(n.id, n.notification_body, n.created);
                break;
            case "error":
                out = new NotificationError(n.id, n.notification_body, n.created);
                break;
        }

        if (out) {
            if(n.notification_importance == "high") {
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
        }

        return out;
    }

    closeProgressWidth(): string {
        return ((5000-this.closeTime)/50)+"%";
    }

    visit(): void {
        if (this.visited) return;
        this.visited = true;
        setTimeout(() => {
            this.opened = true;
        }, 5);
    }

    overlayTick(tickInterval:number): void {
        if (this.closed) return;
        if (this.overed) return;
        if (this.highImportance) return;
        this.closeTime -= tickInterval;
        if (this.closeTime <= 0) {
            this.close();
        }
    }

    tick(tickInterval:number): void {
        if (!this.time) return;
        this.relativeTime = moment(this.time).fromNow();
    }

    over(): void {
        this.overed = true;
    }

    out(): void {
        this.overed = false;
    }

    close(): void {
        if (this.closed) return;
        this.closed = true;
        setTimeout(() => {
            if (this.notificationService) this.notificationService.removeOverlayNotification(this);
            this.notificationService = null;
        }, 500);
    }

}

// Remote notifications
export class NotificationSuccess extends Notification {
    constructor(public id: string, body: INotificationElement[], time: number) {
        super(id, "success", "check-circle", body, time);
    }
}

export class NotificationInfo extends Notification {
    constructor(public id: string, body: INotificationElement[], time: number) {
        super(id, "info", "info-circle", body, time);
    }
}

export class NotificationWarning extends Notification {
    constructor(public id: string, body: INotificationElement[], time: number) {
        super(id, "warning", "exclamation-triangle", body, time);
    }
}

export class NotificationError extends Notification {
    constructor(public id: string, body: INotificationElement[], time: number) {
        super(id, "danger", "times-circle", body, time);
    }
}

// Local flash messages notifications
export abstract class FlashMessage extends Notification {
    constructor(public type: string, icon:string, body: string, reason: Object) {
        super(null, type, icon, body, null, reason);
    }
}

export class FlashMessageSuccess extends FlashMessage {
    constructor(body: string, reason?: Object) {
        super("success", "check-circle", body, reason);
    }
}

export class FlashMessageInfo extends FlashMessage {
    constructor(body: string, reason?: Object) {
        super("info", "info-circle", body, reason);
    }
}

export class FlashMessageWarning extends FlashMessage {
    constructor(body: string, reason?: Object) {
        super("warning", "exclamation-triangle", body, reason);
    }
}

export class FlashMessageError extends FlashMessage {
    constructor(body: string, reason?: Object) {
        super("danger", "times-circle", body, reason);
    }
}

@Injectable()
export class NotificationService {

    public notifications: Notification[] = [];

    public toolbarNotifications: Notification[] = []; //toolbar

    public overlayNotifications: Notification[] = [];

    public unreadNotificationsCount: number = 0;
    public totalNotificationsCount: number = 0;

    public highImportanceOverlay: boolean = false;
    public highImportanceOverlayOpen: boolean = false;

    constructor(protected backendService: BackendService) {
        console.log("NotificationService init");

        // tick for overlay notifs
        setInterval(() => {
            this.overlayNotifications.forEach((n) => {
                n.overlayTick(100);
            });
        }, 100);

        // tick for all notifs
        setInterval(() => {
            this.notifications.forEach((n) => {
                n.tick(10000);
            });
        }, 10000);

        // update notifications info only when user is logged in
        if (this.backendService.personInfoSnapshot) {
            this.backendService.getAllUnconfirmedNotifications();
            this.getRestApiNotifications();
        }

        // and update notifications info after user log in/out
        this.backendService.personInfo.subscribe((pi) => {
            if (pi) {
                this.notificationCleanAll();
                this.backendService.getAllUnconfirmedNotifications();
                this.getRestApiNotifications();
            } else {
                this.notificationCleanAll();
            }
        });

        // register error handler for websocket error
        this.backendService.webSocketErrorOccurred.subscribe(error => this.addFlashMessage(new FlashMessageError("Communication with the back end have failed.", error)));

        // subscribe websocket notifications
        this.backendService.notificationReceived.subscribe(notification => {
            if (notification.messageType == "subscribe_notification" || notification.messageType == "unsubscribe_notification") {
                console.log("(un)subscribed");
            } else {
                console.log(notification);
                var notif:Notification = Notification.fromINotification(notification);
                switch (notification.notification_importance) {
                    case "low":
                        this.addOverlayNotification(notif);
                        break;
                    case "normal":
                        if (!notif.wasRead) {
                            this.unreadNotificationsCount++;
                        }
                        this.totalNotificationsCount++;

                        this.addSavedNotification(notif);
                        this.addOverlayNotification(notif);
                        break;
                    case "high":
                        if (!notif.wasRead) {
                            this.unreadNotificationsCount++;
                        }
                        this.totalNotificationsCount++;

                        this.addSavedNotification(notif);
                        this.addOverlayNotification(notif);
                        break;
                }
            }
        });
    }

    // flash messages :
    addFlashMessage(fm: FlashMessage): void {
        fm.notificationService = this;
        this.overlayNotifications.unshift(fm);
    }

    // remove message (called on click on close btn in FlashMessagesComponent)
    removeFlashMessage(fm: FlashMessage): void {
        fm.notificationService = null;
        var index = this.overlayNotifications.indexOf(fm);
        if (index > -1) {
            this.overlayNotifications.splice(index, 1);
        }
    }

    addOverlayNotification(n: Notification): void {
        n.notificationService = this;
        this.overlayNotifications.unshift(n);

        //this.markNotificationsRead([n]); // TODO: only when mouse moved

        var high = false;
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
        var index = this.overlayNotifications.indexOf(n);
        if (index > -1) {
            this.overlayNotifications.splice(index, 1);
        }

        var high = false;
        this.overlayNotifications.forEach((nn) => {
            if (nn.highImportance) {
                high = true;
            }
        });
        this.setHighImportanceOverlay(high);
    }

    protected highImportanceOverlayTimeout: any = null;
    protected setHighImportanceOverlay(high: boolean) {
        if (this.highImportanceOverlay != high) {
            if (this.highImportanceOverlayTimeout) clearTimeout(this.highImportanceOverlayTimeout);
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

    addSavedNotification(n:Notification): void {
        this.notifications.unshift(n);
        this.toolbarNotifications = this.notifications.slice(0, 10);
    }

    notificationCleanAll(): void {
        this.unreadNotificationsCount = 0;
        this.notifications = [];
        this.toolbarNotifications = [];
        this.overlayNotifications = [];
    }

    markNotificationsRead(n:Notification[]):void {
        var ids = n.map((nn) => {
            if (nn.id && !nn.wasRead) {
                nn.wasRead = true;
                return nn.id;
            }
            return null;
        }).filter((nnn) => !!nnn);
        if (!ids.length) return;
        console.log("MARK READ: ", ids);
        this.unreadNotificationsCount -= ids.length;
        this.backendService.markNotificationRead({notification_id: ids}); // TODO: možná něco udělat s chybou :-)
    }

    mouseMove():void {
        this.markNotificationsRead(this.overlayNotifications);
    }

    onObjectClick(n:Notification, e:INotificationElement) {
        console.log(e);
        // TODO: open objects in Becki
    }

    onButtonClick(n:Notification, b:INotificationButton) {
        n.confirmed = true;
        n.close();
        // TODO: confirm
        //this.backendService.con
    }

    private isNotificationExists(id:string):boolean {
        return !!this.notifications.find((n) => n.id == id);
    }

    getRestApiNotifications(page = 1): Promise<Notification[]> {
        return this.backendService.listNotifications(page)
            .then(list => {
                this.unreadNotificationsCount = list.unread_total;
                this.totalNotificationsCount = list.total;

                console.log(list);

                list.content.forEach((n) => {
                    // TODO: maybe update it!
                    if (!this.isNotificationExists(n.id)) {
                        var nn = Notification.fromINotification(n);
                        this.notifications.unshift(nn);
                    }
                });

                this.notifications = this.notifications.sort((a,b) => {
                    if (a.time > b.time) {
                        return -1;
                    } else if (a.time < b.time) {
                        return 1;
                    }
                    return 0;
                });

                this.toolbarNotifications = this.notifications.slice(0, 10);

                return this.notifications;
            });
    }
}