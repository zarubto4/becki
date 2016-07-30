/*
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */


import * as ngCore from "@angular/core";
import * as libBackEnd from "./lib-back-end/index";
import * as libBeckiCustomValidator from "./lib-becki/custom-validator";
import * as ngRouter from "@angular/router";

import * as libBeckiBackEnd from "./lib-becki/back-end";
import * as libBeckiLayout from "./lib-becki/layout";
import * as libBeckiNotifications from "./lib-becki/notifications";

@ngCore.Component({
    templateUrl: "app/system-interactions-server-new.html",
    directives: [libBeckiCustomValidator.Directive, libBeckiLayout.Component, ngRouter.ROUTER_DIRECTIVES]
})
export class Component implements ngCore.OnInit {

    breadcrumbs:libBeckiLayout.LabeledLink[];

    nameField:string;

    typeField:string;

    types:libBackEnd.DeviceType[];

    backEnd:libBeckiBackEnd.Service;

    notifications:libBeckiNotifications.Service;

    router:ngRouter.Router;

    constructor(@ngCore.Inject("home") home:string, backEnd:libBeckiBackEnd.Service, notifications:libBeckiNotifications.Service, router:ngRouter.Router) {
        "use strict";

        this.breadcrumbs = [
            new libBeckiLayout.LabeledLink(home, ["/"]),
            new libBeckiLayout.LabeledLink("System", ["/system"]),
            new libBeckiLayout.LabeledLink("New Interactions Server", ["/system/interactions/server/new"])
        ];
        this.nameField = "";
        this.typeField = "";
        this.backEnd = backEnd;
        this.notifications = notifications;
        this.router = router;
    }

    ngOnInit():void {
        "use strict";

        this.notifications.shift();
    }



    onCancelClick():void {
        "use strict";

        this.notifications.shift();
        this.router.navigate(["/system"]);
    }

    onSubmit():void{
        "use strict"
        this.notifications.shift();
        
        this.backEnd.createInteractionsServer(this.nameField)
            .then(() => {
                this.notifications.next.push(new libBeckiNotifications.Success("The server " + this.nameField + " has been created."));
                this.router.navigate(["/system"]);
            })
            .catch(reason => {
                // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-281
                this.notifications.current.push(new libBeckiNotifications.Warning("issue/TYRION-281"));
                this.notifications.current.push(new libBeckiNotifications.Danger("The server cannot be created.", reason));
            });

    }

    validateNameField():()=>Promise<boolean> {
        "use strict";

        // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-98
        // see http://youtrack.byzance.cz/youtrack/issue/TYRION-219#comment=109-417
        return () => this.backEnd.getInteractionsServers().then(servers => !servers.find(servers => servers.server_name == this.nameField));
    }
}
