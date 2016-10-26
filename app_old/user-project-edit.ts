/*
 * © 2015-2016 Becki Authors. See the AUTHORS file found in the top-level
 * directory of this distribution.
 */

import * as Rx from "rxjs";
import * as ngCommon from "@angular/common";
import * as ngCore from "@angular/core";
import * as ngRouter from "@angular/router";

import * as libBackEnd from "./lib-back-end/index";
import * as libBeckiBackEnd from "./lib-becki/back-end";
import * as libBeckiCustomValidator from "./lib-becki/custom-validator";
import * as libBeckiLayout from "./lib-becki/layout";
import * as libBeckiNotifications from "./lib-becki/notifications";
import * as libPatternFlyListView from "./lib-patternfly/list-view";

@ngCore.Component({
    templateUrl: "app/user-project-edit.html",
    directives: [
        libBeckiCustomValidator.Directive,
        libBeckiLayout.Component,
        libPatternFlyListView.Component,
        ngCommon.CORE_DIRECTIVES,
        ngRouter.ROUTER_DIRECTIVES
    ]
})
export class Component implements ngCore.OnInit, ngCore.OnDestroy {

    id:string;

    name:string;

    breadcrumbs:libBeckiLayout.LabeledLink[];

    editing:boolean;

    nameField:string;

    descriptionField:string;

    description:string;

    editProject:boolean;

    addCollaborator:boolean;

    activatedRoute:ngRouter.ActivatedRoute;

    backEnd:libBeckiBackEnd.Service;

    notifications:libBeckiNotifications.Service;

    router:ngRouter.Router;

    routeParamsSubscription:Rx.Subscription;

    constructor(@ngCore.Inject("home") home:string, activatedRoute:ngRouter.ActivatedRoute, backEnd:libBeckiBackEnd.Service, notifications:libBeckiNotifications.Service, router:ngRouter.Router) {
        "use strict";

        this.name = "Loading...";
        this.breadcrumbs = [
            new libBeckiLayout.LabeledLink(home, ["/"]),
            new libBeckiLayout.LabeledLink("User", ["/user"]),
            new libBeckiLayout.LabeledLink("Projects", ["/user/projects"])
        ];
        this.editing = false;
        this.nameField = "Loading...";
        this.descriptionField = "Loading...";
        this.description = "Loading...";
        this.editProject = false;
        this.activatedRoute = activatedRoute;
        this.backEnd = backEnd;
        this.notifications = notifications;
        this.router = router;
    }

    ngOnInit():void {
        "use strict";

        this.notifications.shift();
        this.routeParamsSubscription = this.activatedRoute.params.subscribe(params => {
            this.id = params["project"];
            this.refresh();
        });
    }

    ngOnDestroy():void {
        "use strict";

        this.routeParamsSubscription.unsubscribe();
    }

    refresh():void {
        "use strict";
        this.editing = false;
        this.backEnd.getProject(this.id)
            .then(project => {
                return Promise.all<any>([
                    project,
                    Promise.all(project.owners_id.map(id => this.backEnd.getUser(id)))
                ]);
            })
            .then(result => {
                let project:libBackEnd.Project;
                [project] = result;
                this.name = project.project_name;
                this.breadcrumbs.push(new libBeckiLayout.LabeledLink(project.project_name, ["/user/projects", this.id]));
                this.nameField = project.project_name;
                this.descriptionField = project.project_description;
                this.description = project.project_description;
                this.editProject = project.edit_permission;
                this.addCollaborator = project.share_permission;
            })
            .catch(reason => {
                this.notifications.current.push(new libBeckiNotifications.Danger(`The project ${this.id} cannot be loaded.`, reason));
            });
    }


    validateNameField():()=>Promise<boolean> {
        "use strict";
        // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-98
        return () => this.backEnd.getProjects().then(projects => !projects.find(project => project.id != this.id && project.project_name == this.nameField));
    }


    onSubmit():void {
        "use strict";

        this.notifications.shift();
        this.backEnd.updateProject(this.id, this.nameField, this.descriptionField)
            .then(() => {
                this.notifications.current.push(new libBeckiNotifications.Success("The project has been updated."));
                this.refresh();
            })
            .catch(reason => {
                this.notifications.current.push(new libBeckiNotifications.Danger("The project cannot be updated.", reason));
            });
    }

    onCancelClick():void {
        "use strict";

        this.notifications.shift();
        this.router.navigate(["/user/projects", this.id]);
    }

}
