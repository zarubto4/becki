/*
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */


import * as ngCore from "@angular/core";
import * as libBackEnd from "./lib-back-end/index";
import * as libBeckiCustomValidator from "./lib-becki/custom-validator";
import * as ngRouter from "@angular/router-deprecated";

import * as libBeckiBackEnd from "./lib-becki/back-end";
import * as libBeckiLayout from "./lib-becki/layout";
import * as libBeckiNotifications from "./lib-becki/notifications";

@ngCore.Component({
    templateUrl: "app/system-compilation-server.html",
    directives: [libBeckiCustomValidator.Directive, libBeckiLayout.Component, ngRouter.ROUTER_DIRECTIVES]
})
export class Component{
    breadcrumbs:libBeckiLayout.LabeledLink[];

    nameField:string;

    typeField:string;

    serverId:string;

    types:libBackEnd.DeviceType[];

    backEnd:libBeckiBackEnd.Service;

    notifications:libBeckiNotifications.Service;

    router:ngRouter.Router;

    constructor(routeParams:ngRouter.RouteParams,@ngCore.Inject("home") home:libBeckiLayout.LabeledLink, backEnd:libBeckiBackEnd.Service, notifications:libBeckiNotifications.Service, router:ngRouter.Router) {
        "use strict";

        this.serverId=routeParams.get("server");
        this.breadcrumbs = [
            home,
            new libBeckiLayout.LabeledLink("System", ["System"]),
            new libBeckiLayout.LabeledLink("Compilation Server", ["SystemCompilationServer", {server: this.serverId}])
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

    onCancelClick():void{
        "use strict";

        this.notifications.shift();
        this.router.navigate(["System"]);
    }

    onSubmit():void{
        "use strict";

        this.notifications.shift();
        this.backEnd.editCompilationServer(this.serverId,this.nameField)
            .then(() => {
                this.notifications.next.push(new libBeckiNotifications.Success("The server has been updated."));
                this.router.navigate(["System"]);
            })
            .catch(reason => {
                this.notifications.current.push(new libBeckiNotifications.Danger("The server cannot be updated.", reason));
            });
    }


}