/*
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */

import * as Rx from "rxjs";
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
import * as libPatternFlyListView from "./lib-patternfly/list-view";


@ngCore.Component({
    templateUrl: "app/user-interactions-block-group.html",
    directives: [
        libBeckiCustomValidator.Directive,
        libBeckiFieldInteractionsScheme.Component,
        libBeckiLayout.Component,
        ngCommon.CORE_DIRECTIVES,
        libPatternFlyListView.Component]
})
export class Component implements ngCore.OnInit, ngCore.OnDestroy {

    id:string;

    group:libBackEnd.TypeOfBlock;

    breadcrumbs:libBeckiLayout.LabeledLink[];

    projects:libBackEnd.Project[];
    
    project:libBackEnd.Project;
    
    blocks:libPatternFlyListView.Item[];

    editing:boolean;

    nameField:string;

    projectField:string;

    project_idField:string;

    descriptionField:string;

    edit_permission:boolean;

    activatedRoute:ngRouter.ActivatedRoute;

    backEnd:libBeckiBackEnd.Service;

    notifications:libBeckiNotifications.Service;

    router:ngRouter.Router;

    routeParamsSubscription:Rx.Subscription;

    constructor(router:ngRouter.Router, @ngCore.Inject("home") home:string, activatedRoute:ngRouter.ActivatedRoute, backEnd:libBeckiBackEnd.Service, notifications:libBeckiNotifications.Service) {
        "use strict";

        this.breadcrumbs = [
            new libBeckiLayout.LabeledLink(home, ["/"]),
            new libBeckiLayout.LabeledLink("Interactions Block Groups", ["/user/interactions/block/groups"])
        ];
        this.editing = false;
        this.nameField = "Loading...";
        this.projectField = "";
        this.descriptionField = "Loading...";
        this.project_idField = "Loading...";
        this.edit_permission = false;
        this.activatedRoute = activatedRoute;
        this.backEnd = backEnd;
        this.notifications = notifications;
        this.router = router;

    }

    ngOnInit():void {
        "use strict";

        this.notifications.shift();
        this.routeParamsSubscription = this.activatedRoute.params.subscribe(params => {
            this.id = params["group"];
            this.refresh();
        });
    }

    ngOnDestroy():void {
        "use strict";

        this.routeParamsSubscription.unsubscribe();
    }

    onAddBlocko():void{
        this.router.navigate(["/user/interactions/block/new"]);
    }

    refresh():void {
        "use strict";

        this.editing = false;

        this.backEnd.getTypeOfBlock(this.id)
            .then(group => {
                return Promise.all<any>([
                    group,
                this.backEnd.getProjects()])
            })
            .then(result =>
            {
                let group:libBackEnd.TypeOfBlock;
                let projects:libBackEnd.Project[];
                [group,projects]=result;
                this.group = group;
                this.breadcrumbs.push(new libBeckiLayout.LabeledLink(group.name, ["/user/interactions/block/groups", this.id]));
                this.breadcrumbs[2].label = group.name;
                this.nameField = group.name;
                this.project_idField=group.project_id;
                this.descriptionField = group.general_description;
                this.blocks = group.blockoBlocks.map( block => new libPatternFlyListView.Item(block.id, block.name,block.general_description,["/user/interactions/blocks", block.id],block.delete_permission));
                this.projects = projects;
                this.edit_permission = group.edit_permission;
                this.project = this.projects.find(project => group.project_id == project.id);

            })
            .catch(reason => {
                this.notifications.current.push(new libBeckiNotifications.Danger(`The group ${this.id} cannot be loaded.`, reason));
            });
    }

    onEditClick():void {
        "use strict";

        this.editing = !this.editing;
    }

    validateNameField():()=>Promise<boolean> {
        "use strict";

        // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-98
        return () => this.backEnd.getAllTypeOfBlock().then(producers => !producers.find(producer => producer.id != this.id && producer.name == this.nameField));
    }

    getProject():string {
        "use strict";

        return libBecki.getAdvancedField(this.projectField, this.projects.map(project => project.id));
    }

    onProjectChange():void{
        
    }

    onProjectClick():void{
        this.router.navigate(["/user/projects", this.project_idField]);
    }

    onSubmit():void {
        "use strict";

        this.notifications.shift();
        Promise.resolve()
            .then(() => {
                return this.backEnd.updateInteractionsBlockGroups(this.id, this.nameField, this.descriptionField,this.project_idField);
            })
            .then(() => {
                this.notifications.current.push(new libBeckiNotifications.Success("The blocko group has been updated."));
                this.refresh();
            })
            .catch(reason => {
                this.notifications.current.push(new libBeckiNotifications.Danger("The blocko group cannot be updated.", reason));
            });
    }

    onCancelClick():void {
        "use strict";

        this.notifications.shift();
        this.refresh();
    }

}
