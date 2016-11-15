/**
 * Created by davidhradek on 08.08.16.
 */

import {Injectable} from "@angular/core";
import {BugFoundError, PermissionMissingError, UnauthorizedError} from "../backend/BeckiBackend";

export abstract class FlashMessage {

    onTopTimeout: any = null;
    visited: boolean = false;

    htmlBody: boolean = false;

    isTop: boolean = false;
    open: boolean = false;
    flashMessagesService:FlashMessagesService = null;

    constructor(public type: string, public icon: string, public body: string, reason?: Object, htmlBody?: boolean) {
        if (htmlBody) {
            this.htmlBody = htmlBody;
        }
        if (reason instanceof BugFoundError) {
            this.body += " An unexpected error ";
            if (reason.userMessage) {
                this.body += `with message "${reason.userMessage}" `;
            }
            this.body += `have occurred. Please, report following text to administrators in order to get it fixed: ${JSON.stringify(reason.adminMessage)}`;
        } else if (reason instanceof PermissionMissingError) {
            if (reason.userMessage) {
                this.body += ` An authorization error with message "${reason.userMessage}" have occurred.`;
            }
            this.body += " Please ask an authorized person to give you the necessary permissions.";
        } else if (reason instanceof UnauthorizedError) {
            this.body += ` An authorization error with message "${reason.userMessage}" have occurred. Please sign in.`;
        }
    }

    visit(): void {
        if (this.visited) return;
        this.visited = true;
        setTimeout(() => {
            this.open = true;
        }, 5);
    }

    unsetTop(): void {
        if (this.onTopTimeout) {
            clearTimeout(this.onTopTimeout);
        }
    }

    setTop(): void {
        this.onTopTimeout = setTimeout(() => {
            this.close()
        }, 5000);
    }

    close(): void {
        this.open = false;
        setTimeout(() => {
            if (this.flashMessagesService) this.flashMessagesService.removeFlashMessage(this);
            this.flashMessagesService = null;
        }, 500);
    }
}

export class FlashMessageSuccess extends FlashMessage {
    constructor(body: string, reason?: Object, htmlBody?: boolean) {
        super("success", "check-circle", body, reason, htmlBody);
    }
}

export class FlashMessageInfo extends FlashMessage {
    constructor(body: string, reason?: Object, htmlBody?: boolean) {
        super("info", "info-circle", body, reason, htmlBody);
    }
}

export class FlashMessageWarning extends FlashMessage {
    constructor(body: string, reason?: Object, htmlBody?: boolean) {
        super("warning", "exclamation-triangle", body, reason, htmlBody);
    }
}

export class FlashMessageDanger extends FlashMessage {
    constructor(body: string, reason?: Object, htmlBody?: boolean) {
        super("danger", "times-circle", body, reason, htmlBody);
    }
}

export class FlashMessageError extends FlashMessage {
    constructor(body: string, reason?: Object, htmlBody?: boolean) {
        super("danger", "times-circle", body, reason, htmlBody);
    }
}

@Injectable()
export class FlashMessagesService {

    messages: FlashMessage[] = [];

    constructor() {
        console.log("FlashMessagesService init");
    }

    addFlashMessage(fm: FlashMessage): void {
        this.messages.forEach((m) => {
            m.unsetTop();
        });
        fm.flashMessagesService = this;
        this.messages.push(fm);
        fm.setTop();
    }

    // remove message (called on click on close btn in FlashMessagesComponent)
    removeFlashMessage(fm: FlashMessage): void {
        var index = this.messages.indexOf(fm);
        if (index > -1) {
            this.messages.splice(index, 1);
        }
        if (this.messages.length) {
            this.messages[this.messages.length - 1].setTop();
        }
    }
}