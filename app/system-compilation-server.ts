/*
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */


import * as Rx from "rxjs";
import * as ngCore from "@angular/core";
import * as ngRouter from "@angular/router";

import * as libBackEnd from "./lib-back-end/index";
import * as libBeckiBackEnd from "./lib-becki/back-end";
import * as libBeckiCustomValidator from "./lib-becki/custom-validator";
import * as libBeckiLayout from "./lib-becki/layout";
import * as libBeckiNotifications from "./lib-becki/notifications";

@ngCore.Component({
    templateUrl: "app/system-compilation-server.html",
    directives: [libBeckiCustomValidator.Directive, libBeckiLayout.Component, ngRouter.ROUTER_DIRECTIVES]
})
export class Component implements ngCore.OnInit, ngCore.OnDestroy {
    breadcrumbs:libBeckiLayout.LabeledLink[];

    nameField:string;

    typeField:string;

    serverId:string;

    types:libBackEnd.TypeOfBoard[];

    activatedRoute:ngRouter.ActivatedRoute;

    backEnd:libBeckiBackEnd.Service;

    notifications:libBeckiNotifications.Service;

    router:ngRouter.Router;

    routeParamsSubscription:Rx.Subscription;

    constructor(@ngCore.Inject("home") home:string, activatedRoute:ngRouter.ActivatedRoute, backEnd:libBeckiBackEnd.Service, notifications:libBeckiNotifications.Service, router:ngRouter.Router) {
        "use strict";

        this.breadcrumbs = [
            new libBeckiLayout.LabeledLink(home, ["/"]),
            new libBeckiLayout.LabeledLink("System", ["/system"]),
            new libBeckiLayout.LabeledLink("Compilation Servers", ["/system/compilation/servers"])
        ];
        this.nameField = "";
        this.typeField = "";
        this.activatedRoute = activatedRoute;
        this.backEnd = backEnd;
        this.notifications = notifications;
        this.router = router;
    }

    ngOnInit():void {
        "use strict";

        this.notifications.shift();
        this.routeParamsSubscription = this.activatedRoute.params.subscribe(params => {
            this.serverId = params["server"];
            this.breadcrumbs.push(new libBeckiLayout.LabeledLink("Compilation Server", ["/system/compilation/servers", this.serverId]));
        });
    }

    ngOnDestroy():void {
        "use strict";

        this.routeParamsSubscription.unsubscribe();
    }

    onCancelClick():void{
        "use strict";

        this.notifications.shift();
        this.router.navigate(["/system/compilation/servers"]);
    }

    onSubmit():void{
        "use strict";

        this.notifications.shift();
        this.backEnd.editCompilationServer(this.serverId,this.nameField)
            .then(() => {
                this.notifications.next.push(new libBeckiNotifications.Success("The server has been updated."));
                this.router.navigate(["/system/compilation/servers"]);
            })
            .catch(reason => {
                this.notifications.current.push(new libBeckiNotifications.Danger("The server cannot be updated.", reason));
            });
    }


}