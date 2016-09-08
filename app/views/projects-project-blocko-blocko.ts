/**
 * Created by davidhradek on 17.08.16.
 */

import {Component, OnInit, Injector, OnDestroy} from "@angular/core";
import {LayoutMain} from "../layouts/main";
import {BaseMainComponent} from "./BaseMainComponent";
import {FlashMessageError, FlashMessageSuccess} from "../services/FlashMessagesService";
import {ROUTER_DIRECTIVES} from "@angular/router";
import {Subscription} from "rxjs/Rx";
import {IProject, IBProgram} from "../backend/TyrionAPI";

@Component({
    selector: "view-projects-project-blocko-blocko",
    templateUrl: "app/views/projects-project-blocko-blocko.html",
    directives: [ROUTER_DIRECTIVES, LayoutMain],
})
export class ProjectsProjectBlockoBlockoComponent extends BaseMainComponent implements OnInit, OnDestroy {

    projectId: string;
    blockoId: string;

    routeParamsSubscription:Subscription;

    project:IProject = null;
    blockoProgram:IBProgram = null;

    constructor(injector:Injector) {super(injector)};

    ngOnInit():void {
        this.routeParamsSubscription = this.activatedRoute.params.subscribe(params => {
            this.projectId = params["project"];
            this.blockoId = params["blocko"];
            this.refresh();
        });
    }

    ngOnDestroy():void {
        this.routeParamsSubscription.unsubscribe();
    }

    refresh():void {
        /*this.backendService.getProject(this.projectId)
            .then((project:Project) => {
                this.project = project;
                return this.backendService.getInteractionsScheme(this.blockoId);
            })
            .catch(reason => {
                this.addFlashMessage(new FlashMessageError(`The blocko cannot be loaded.`, reason));
            });*/
        this.backendService.getBProgram(this.blockoId)
            .then((blockoProgram) => {
                this.blockoProgram = blockoProgram;
                console.log(this.blockoProgram);
            })
            .catch(reason => {
                this.addFlashMessage(new FlashMessageError(`The blocko cannot be loaded.`, reason));
            });

        //this.backendService.addVersionToInteractionsScheme("testName", "testDescription", "{}", [], {board_id:"", c_program_version_id:""}, this.blockoId);

    }

}
