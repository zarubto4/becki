/**
 * Created by DominikKrisztof on 22/08/16.
 */
import {Injectable} from "@angular/core";
import {BackendService} from "./BackendService";
import moment = require("moment/moment");
import {INotification} from "../backend/TyrionAPI";


export abstract class Notification {

    protected _relativeTime: string = "";

    constructor(public id: string, public type: string, public icon: string, public body: string, public time: number, reason?: Object) {

        this._relativeTime = moment(this.time).startOf('minute').fromNow(false);


        //ID potvrzení čtení notifikací
    }

}

export class NotificationSuccess extends Notification {
    constructor(public id: string, body: string, time: number, reason?: Object) {
        super(id, "success", "check-circle", body, time, reason);
    }
}

export class NotificationInfo extends Notification {
    constructor(public id: string, body: string, time: number, reason?: Object) {
        super(id, "info", "info-circle", body, time, reason);
    }
}

export class NotificationWarning extends Notification {
    constructor(public id: string, body: string, time: number, reason?: Object) {
        super(id, "warning", "exclamation-triangle", body, time, reason);
    }
}

export class NotificationDanger extends Notification {
    constructor(public id: string, body: string, time: number, reason?: Object) {
        super(id, "danger", "times-circle", body, time, reason);
    }
}

export class NotificationError extends Notification {
    constructor(public id: string, body: string, time: number, reason?: Object) {
        super(id, "danger", "times-circle", body, time, reason);
    }
}


@Injectable()
export class NotificationService {

    public notifications: Notification[] = [];

    public menuNotifications: Notification[] = [];

    public unreadedNotifications: number = 0;

    constructor(protected backendService: BackendService) {
        console.log("NotificationService init");


        toastr.options = {
            "closeButton": true,
            "debug": false,
            "newestOnTop": true,
            "progressBar": true,
            "positionClass": "toast-top-right",
            "preventDuplicates": false,
            "onclick": null,
            "showDuration": 300,
            "hideDuration": 1000,
            "timeOut": 5000,
            "extendedTimeOut": 1000,
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut"
        };

        this.backendService.getAllUnconfirmedNotifications();

        this.backendService.personInfo.subscribe((pi) => {
            if (pi) {
                this.getRestApiNotifications();


            } else {
                this.notificationCleanArray();
            }
        });

        this.backendService.notificationReceived.subscribe(notification => {
            if (notification.messageType == "subscribe_notification" || notification.messageType == "unsubscribe_notification") {
                console.log("(un)subscribed");
            } else {
                var notif = this.notificationParse(notification);
                switch (notification.notification_importance) {
                    case "low":
                        this.showToastr(notif);
                        break;

                    case "normal":
                        this.unreadedNotifications++;
                        var notif = this.notificationParse(notification);
                        this.addNotification(notif);
                        this.showToastr(notif);
                        break;

                    case "high":
                        //TODO zablokování celé stránky a nutnost přečtení si této notifikace, nutno probrat s Davidem
                        break;

                }
            }
        });
    }

    showToastr(notification: Notification): void {
        switch (notification.type) {
            case "success":
                toastr.success(notification.body);
                break;
            case "warning":
                toastr.warning(notification.body);
                break;
            case "error":
                toastr.error(notification.body);
                break;
            case "info":
            default:
                toastr.info(notification.body);
                break;
        }
    }

    wasReadedNotifications(): void {
        //TODO na najetou notifikaci poslat sem "was read" a odebrat jednu nezobrazenou notifikaci
        this.unreadedNotifications = 0;
    }


    countUnreadNotifications(): number { //tato metoda bude nejspíše smazána, je zde pouze pro jednodušší přístup k promněné která se bude nejspíše měnit
        return this.unreadedNotifications;
    }

    notificationParse(notification: INotification): Notification {
        switch (notification.notification_level) {
            case "info":
                return new NotificationInfo(notification.id, this.notificationBodyUnparse(notification), notification.created);
            case "success":
                return new NotificationSuccess(notification.id, this.notificationBodyUnparse(notification), notification.created);
            case "warning":
                return new NotificationWarning(notification.id, this.notificationBodyUnparse(notification), notification.created);
            case "error":
                return new NotificationError(notification.id, this.notificationBodyUnparse(notification), notification.created);

        }
        return null;
    }

    addNotification(notification: Notification): void {
        this.notifications.unshift(notification);
        this.menuNotifications = this.notifications.slice(0, 10);

    }

    notificationCleanArray(): void {
        this.notifications = [];
        this.menuNotifications = [];
    }

    notificationBodyUnparse(notification: INotification): string {
        let bodyText: string;
        bodyText = "";
        (<any[]>notification.notification_body).map((body: any) => {
            switch (body.type) {
                case "text":
                    bodyText += body.value;
                    break;

                case "bold_text":
                    bodyText += ("<b>" + body.value + "</b>");
                    break;

                case "object":
                    bodyText += ("<a href='" + body.value + "/" + body.id + "'>" + body.label);
                    break;

                case "link":
                    bodyText += ("<a href='" + body.url + "'>" + body.label + "</a>");
                    break;
            }
        });
        if (notification.confirmation_required) {
            bodyText += ("<input (click)='#'> OK "); //TODO notification confirmed bude držet dokud se neodklikne, změnit tady nastavení toastr messeage
        }
        return bodyText;
    }

    sentRestApiNotificationWasRead(id:string):void{
        this.backendService.confirmNotification(id);
    }

    getRestApiNotifications(page = 1): Promise<Notification[]> {
        this.notificationCleanArray();
        //TODO existuje "unread total, nepřečtené notifikace zvýrazníme podle boolean "was_read", poté co se na ně najede tak poslat že jsoou přečtené
        this.backendService.listNotifications(page).then(list => list.content.map(notification => {
            this.addNotification(this.notificationParse(notification));
        })).then(() => {
            this.notifications.reverse();
            return this.notifications;
        });
        return null;
    }
}