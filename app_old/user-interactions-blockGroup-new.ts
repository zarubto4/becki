/*
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level
 * directory of this distribution.
 */

import * as ngCommon from "@angular/common";
import * as ngCore from "@angular/core";
import * as ngRouter from "@angular/router";

import * as libBackEnd from "./lib-back-end/index";
import * as libBecki from "./lib-becki/index";
import * as libBeckiBackEnd from "./lib-becki/back-end";
import * as libBeckiCustomValidator from "./lib-becki/custom-validator";
import * as libBeckiFieldInteractionsScheme from "./lib-becki/field-interactions-scheme";
import * as libBeckiLayout from "./lib-becki/layout";
import * as libBeckiNotifications from "./lib-becki/notifications";

@ngCore.Component({
    templateUrl: "app/user-interactions-blockGroups-new.html",
    directives: [
        libBeckiCustomValidator.Directive,
        libBeckiFieldInteractionsScheme.Component,
        libBeckiLayout.Component,
        ngCommon.CORE_DIRECTIVES
    ]
})
export class Component implements ngCore.OnInit {

    breadcrumbs:libBeckiLayout.LabeledLink[];

    projectField:string;

    projects:libBackEnd.Project[];

    nameField:string;

    descriptionField:string;
    
    backEnd:libBeckiBackEnd.Service;

    notifications:libBeckiNotifications.Service;

    router:ngRouter.Router;

    constructor(@ngCore.Inject("home") home:string, backEnd:libBeckiBackEnd.Service, notifications:libBeckiNotifications.Service, router:ngRouter.Router) {
        "use strict";

        this.breadcrumbs = [
            new libBeckiLayout.LabeledLink(home, ["/"]),
            new libBeckiLayout.LabeledLink("User", ["/user"]),
            new libBeckiLayout.LabeledLink("New block groups", ["/user/interactions/block/group/new"])
        ];
        this.projectField = "";
        this.nameField = "";
        this.descriptionField = "";
        this.backEnd = backEnd;
        this.notifications = notifications;
        this.router = router;
    }

    ngOnInit():void {
        "use strict";

        this.notifications.shift();
        this.backEnd.getProjects()
            .then(projects => {
                this.projects = projects.filter(project => project.update_permission);
                })
            .catch(reason => {
                this.notifications.current.push(new libBeckiNotifications.Danger("Projects cannot be loaded.", reason));
            });
    }

    getProject():string {
        "use strict";

        return libBecki.getAdvancedField(this.projectField, this.projects.map(project => project.id));
    }
    
    validateNameField():()=>Promise<boolean> {
        "use strict";

        // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-98
        return () => this.backEnd.getAllTypeOfBlock()
            .then(groups => !groups.find(groups => groups.name == this.nameField));
    }

    onSubmit():void {
        "use strict";

        this.notifications.shift();
        Promise.resolve(
            this.getProject() || this.backEnd.createDefaultProject().then(project => {
                this.projects = [project];
                this.projectField = project.id;
                return project.id;
            }))
            .then(project => {
                return this.backEnd.createTypeOfBlock(this.nameField, this.descriptionField, project);
            })
            .then(() => {
                this.notifications.next.push(new libBeckiNotifications.Success("The scheme have been created."));
                this.router.navigate(["/user/interactions/block/groups"]);
            })
            .catch(reason => {
                this.notifications.current.push(new libBeckiNotifications.Danger("The scheme cannot be created.", reason));
            });
    }

    onCancelClick():void {
        "use strict";

        this.notifications.shift();
        this.router.navigate(["/user/interactions/block/groups"]);
    }
}
