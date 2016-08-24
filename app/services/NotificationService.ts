/**
 * Created by DominikKrisztof on 22/08/16.
 */
import {Injectable} from "@angular/core";
import {BackEndService} from "./BackEndService";
import * as libBackEnd from "../lib-back-end/index";
import moment = require("moment/moment");


export abstract class Notification {

    protected _relativeTime:string = "";
    constructor(public id:string, public type:string, public icon:string, public body:string, public time:number, reason?:Object) {

        this._relativeTime= moment(this.time).startOf('hour').fromNow();




        //ID potvrzení čtení notifikací
    }

}

export class NotificationSuccess extends Notification {
    constructor(public id:string, body:string,time:number, reason?:Object) {
        super(id, "success", "check-circle", body,time, reason);
    }
}

export class NotificationInfo extends Notification {
    constructor(public id:string, body:string,time:number, reason?:Object) {
        super(id, "info", "info-circle", body,time, reason);
    }
}

export class NotificationWarning extends Notification {
    constructor(public id:string, body:string,time:number, reason?:Object) {
        super(id, "warning", "exclamation-triangle", body,time, reason);
    }
}

export class NotificationDanger extends Notification {
    constructor(public id:string, body:string,time:number, reason?:Object) {
        super(id, "danger", "times-circle", body,time, reason);
    }
}

export class NotificationError extends Notification {
    constructor(public id:string, body:string,time:number, reason?:Object) {
        super(id, "danger", "times-circle", body,time, reason);
    }
}

export class NotificationQuestion extends Notification {
    constructor(public id:string, body:string,time:number, reason?:Object) {
        super(id, "info", "eye"/*fa-question-circle-o*/, body,time, reason);
    }
}

@Injectable()
export class NotificationService {

    public notifications:Notification[] = [];
    
    public menuNotifications:Notification[] = [];

    public unreadedNotifications:number=0;
    constructor(protected backEndService:BackEndService) {
        console.log("NotificationService init");
        // není potřeba, udělá si to sám WS  ... this.backEndService.requestNotificationsSubscribe();//přihlásí se automaticky k odběru notifikací
        this.backEndService.getUnconfirmedNotification();//.then(console.log("get uncomfirmed notifications")); //TODO nebylo by třeba je napsat někam jinam?

        this.backEndService.personInfo.subscribe((pi) => {
            if (pi) {
                //TODO:request first ten
                this.getRestApiNotifications();


            } else {
                this.notificationCleanArray();
            }
        });

        this.backEndService.notificationReceived.subscribe(notification => {
            if (notification.messageType == "subscribe_notification" || notification.messageType == "unsubscribe_notification") {
                console.log("subscribed");
            } else {
                this.unreadedNotifications++;
                this.notificationLevelSort(notification);
            }
        });
    }

    wasReadedNotifications():void{ //TODO https://youtrack.byzance.cz/youtrack/issue/TYRION-360
        //až bude sjednoceno názosloví je třeba za pomocí was_read
        this.unreadedNotifications=0;
    }


    countUnreadNotifications():number { //tato metoda bude nejspíše smazána, je zde pouze pro jednodušší přístup k promněné která se bude nejspíše měnit
        return this.unreadedNotifications;
    }

    notificationLevelSort(notification:libBackEnd.Notification):void {
        switch (notification.notification_level) {
            case "info":
                this.addNotification(new NotificationInfo(notification.messageId, this.notificationBodyUnparse(notification),notification.created));
                break;

            case "success":
                this.addNotification(new NotificationSuccess(notification.messageId, this.notificationBodyUnparse(notification),notification.created));
                break;

            case "warning":
                this.addNotification(new NotificationWarning(notification.messageId, this.notificationBodyUnparse(notification),notification.created));
                break;

            case "error":
                this.addNotification(new NotificationError(notification.messageId, this.notificationBodyUnparse(notification),notification.created));
                break;

            case "question":
                this.addNotification(new NotificationInfo(notification.messageId, this.notificationBodyUnparse(notification),notification.created));
                break;
        }
    }

    addNotification(notification:Notification):void {
        this.notifications.unshift(notification);
        this.menuNotifications = this.notifications.slice(0, 10);

    }

    notificationCleanArray():void {
        this.notifications = [];
        this.menuNotifications = [];
    }

    notificationBodyUnparse(notification:libBackEnd.Notification):string {
        let bodyText:string;
        bodyText = "";
        notification.notification_body.map((body:any) => {
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
        console.log(bodyText);
        return bodyText;
    }

    getRestApiNotifications(page = 1):Promise<Notification[]> {
        this.notificationCleanArray();
        this.backEndService.getNotificationsByPage(page).then(list => list.content.map(notification => {
            this.notificationLevelSort(notification);
        })).then(() => {
            return this.notifications
        });
        return null;
    }
}