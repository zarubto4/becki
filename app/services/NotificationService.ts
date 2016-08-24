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


        toastr.options = {
            "closeButton": true,
            "debug": false,
            "newestOnTop": true,
            "progressBar": true,
            "positionClass": "toast-top-right",
            "preventDuplicates": false,
            "onclick": null,
            "showDuration": "300",
            "hideDuration": "1000",
            "timeOut": "5000",
            "extendedTimeOut": "1000",
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut"
        };

        this.backEndService.getUnconfirmedNotification();//.then(console.log("get uncomfirmed notifications")); //TODO nebylo by třeba je napsat někam jinam?

        this.backEndService.personInfo.subscribe((pi) => {
            if (pi) {
                //TODO:request first ten
                this.getRestApiNotifications();


            } else {
                this.notificationCleanArray();
            }
        });

        this.backEndService.notificationReceived.subscribe(notification => { //TODO https://youtrack.byzance.cz/youtrack/issue/TYRION-360
            if (notification.messageType == "subscribe_notification" || notification.messageType == "unsubscribe_notification") {
                console.log("(un)subscribed");
            } else {
                this.unreadedNotifications++;
                var notif = this.notificationParse(notification);
                this.addNotification(notif);
                this.showToastr(notif);
            }
        });
    }

    showToastr(notification:Notification):void{
        toastr[notification.type](notification.body);
    }
    wasReadedNotifications():void{ //TODO https://youtrack.byzance.cz/youtrack/issue/TYRION-360
        //až bude sjednoceno názosloví je třeba za pomocí was_read
        this.unreadedNotifications=0;
    }


    countUnreadNotifications():number { //tato metoda bude nejspíše smazána, je zde pouze pro jednodušší přístup k promněné která se bude nejspíše měnit
        return this.unreadedNotifications;
    }

    notificationParse(notification:libBackEnd.Notification):Notification {
        switch (notification.notification_level) {
            case "info":
                return new NotificationInfo(notification.messageId, this.notificationBodyUnparse(notification),notification.created);
                break;

            case "success":
                return new NotificationSuccess(notification.messageId, this.notificationBodyUnparse(notification),notification.created);
                break;

            case "warning":
                return new NotificationWarning(notification.messageId, this.notificationBodyUnparse(notification),notification.created);
                break;

            case "error":
                return new NotificationError(notification.messageId, this.notificationBodyUnparse(notification),notification.created);
                break;

            case "question":
                return new NotificationInfo(notification.messageId, this.notificationBodyUnparse(notification),notification.created);
                break;
        }
        return null;
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
            this.addNotification(this.notificationParse(notification));
        })).then(() => {
            return this.notifications
        });
        return null;
    }
}