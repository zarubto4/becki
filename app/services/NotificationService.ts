/**
 * Created by DominikKrisztof on 22/08/16.
 */
import {Injectable} from "@angular/core";
import {BackEndService} from "./BackEndService";
import * as libBackEnd from "../lib-back-end/index";

export abstract class Notification {
    constructor(public type:string, public icon:string, public body:string, reason?:Object) {

    }
}

export class NotificationSuccess extends Notification {
    constructor(body:string, reason?:Object) {
        super("success", "check-circle", body, reason);
    }
}

export class NotificationInfo extends Notification {
    constructor(body:string, reason?:Object) {
        super("info", "info-circle", body, reason);
    }
}

export class NotificationWarning extends Notification {
    constructor(body:string, reason?:Object) {
        super("warning", "exclamation-triangle", body, reason);
    }
}

export class NotificationDanger extends Notification {
    constructor(body:string, reason?:Object) {
        super("danger", "times-circle", body, reason);
    }
}

export class NotificationError extends Notification {
    constructor(body:string, reason?:Object) {
        super("danger", "times-circle", body, reason);
    }
}

export class NotificationQuestion extends Notification {
    constructor(body:string, reason?:Object) {
        super("info", "eye"/*fa-question-circle-o*/, body, reason);
    }
}

@Injectable()
export class NotificationService {

    public notifications:Notification[] = [];

    constructor(protected backEndService:BackEndService) {
        console.log("NotificationService init");
        this.backEndService.requestNotificationsSubscribe();//přihlásí se automaticky k odběru notifikací
        this.backEndService.getUnconfirmedNotification();//.then(console.log("get uncomfirmed notifications")); //TODO nebylo by třeba je napsat někam jinam?
        
        this.backEndService.notificationReceived.subscribe(notification => {
            if(notification.messageType="subscribe_notification" || notification.messageType == "unsubscribe_notification"){
                console.log("subscribed");
            }else{
            switch (notification.notification_level) {
                case "info":
                    this.notifications.push(new NotificationInfo(this.notificationBodyUnparse(notification)));
                    break;

                case "success":
                    this.notifications.push(new NotificationSuccess(this.notificationBodyUnparse(notification)));
                    break;

                case "warning":
                    this.notifications.push(new NotificationWarning(this.notificationBodyUnparse(notification)));
                    break;

                case "error":
                    this.notifications.push(new NotificationError(this.notificationBodyUnparse(notification)));
                    break;

                case "question":
                    this.notifications.push(new NotificationInfo(this.notificationBodyUnparse(notification)));
                    break;
                }
            }
        });
    }

    notificationBodyUnparse(notification:libBackEnd.Notification):string{
        let bodyText:string;
        bodyText="";
        notification.notification_body.map((body:any) =>{
            switch(body.type){
                case "text":
                    bodyText+= body.value;
                    break;

                case "bold_text":
                    bodyText+= ("<b>"+body.value+"</b>");
                    break;

                case "object":
                    bodyText+=("<a href='"+body.value+"/"+body.id+"'>"+body.label);
                    break;

                case "link":
                    bodyText+=("<a href='"+body.url+"'>"+body.label+"</a>");
                    break;
            }
        })
        console.log(bodyText);
        return bodyText;
    }


    getFirstTenNotifications() :Notification[] {
   var listedNotification:Notification[];

     listedNotification = this.notifications.slice(0,10);

      return listedNotification;
    }
}