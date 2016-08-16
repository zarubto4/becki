/**
 * Created by davidhradek on 08.08.16.
 */

import {Injectable} from "@angular/core";

import * as libBackEnd from "../lib-back-end/index";

export abstract class FlashMessage {

    visited:boolean = false;
    visitedTimeout:any = null;

    constructor(public type:string, public icon:string, public body:string, reason?:Object) {
        if (reason instanceof libBackEnd.BugFoundError) {
            this.body += " An unexpected error ";
            if (reason.userMessage) {
                this.body += `with message "${reason.userMessage}" `;
            }
            this.body += `have occurred. Please, report following text to administrators in order to get it fixed: ${JSON.stringify(reason.adminMessage)}`;
        } else if (reason instanceof libBackEnd.PermissionMissingError) {
            if (reason.userMessage) {
                this.body += ` An authorization error with message "${reason.userMessage}" have occurred.`;
            }
            this.body += " Please ask an authorized person to give you the necessary permissions.";
        } else if (reason instanceof libBackEnd.UnauthorizedError) {
            this.body += ` An authorization error with message "${reason.userMessage}" have occurred. Please sign in.`;
        }
    }

    visitStop():void {
        if (this.visitedTimeout) {
            clearTimeout(this.visitedTimeout);
            this.visitedTimeout = null;
        }
    }

    visit():void {
        if (this.visited || this.visitedTimeout) return;
        this.visitedTimeout = setTimeout(() => {
            this.visitedTimeout = null;
            this.visited = true;
        }, 1000);
        // after 1s of message on screen (called visit() and don't interrupted by visitStop()) we set visited to true
    }
}

export class FlashMessageSuccess extends FlashMessage {
    constructor(body:string, reason?:Object) {
        super("success", "check-circle", body, reason);
    }
}

export class FlashMessageInfo extends FlashMessage {
    constructor(body:string, reason?:Object) {
        super("info", "info-circle", body, reason);
    }
}

export class FlashMessageWarning extends FlashMessage {
    constructor(body:string, reason?:Object) {
        super("warning", "exclamation-triangle", body, reason);
    }
}

export class FlashMessageDanger extends FlashMessage {
    constructor(body:string, reason?:Object) {
        super("danger", "times-circle", body, reason);
    }
}

export class FlashMessageError extends FlashMessage {
    constructor(body:string, reason?:Object) {
        super("danger", "times-circle", body, reason);
    }
}

@Injectable()
export class FlashMessagesService {

    messages:FlashMessage[] = [];

    constructor() {
        console.log("FlashMessagesService init");
    }

    addFlashMessage(fm:FlashMessage):void {
        this.messages.push(fm);
    }

    // remove message (called on click on close btn in FlashMessagesComponent)
    removeFlashMessage(fm:FlashMessage):void {
        var index = this.messages.indexOf(fm);
        if (index > -1) {
            this.messages.splice(index, 1);
        }
    }

    // stop visiting all messages (called on destroy of FlashMessagesComponent)
    visitStop():void {
        this.messages.forEach((fm:FlashMessage) => {
            fm.visitStop();
        })
    }

    // remove all visited messages (called on destroy of FlashMessagesComponent)
    flushVisited():void {
        this.messages = this.messages.filter((fm:FlashMessage) => {
            return !fm.visited;
        });
    }
}